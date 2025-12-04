import { Client, Seller, Buyer, Item, Invoice, PaymentMethods, Currencies, Languages } from "szamlazz.js";
import type { OrderData } from "./email-service";

// Seller configuration (your business details)
// EV: SEBESTYÉN MÁTYÁS
// Adószám: 91552444-2-43
// Cím: 1124 Budapest, Pagony utca 32-34. C ép. FS em. 2 ajtó
const seller = new Seller({
  bank: {
    name: "", // Add your bank name if needed
    accountNumber: "", // Add your bank account number if needed
  },
  email: {
    replyToAddress: "info@smoky-fish.hu",
    subject: "Számla - Smoky Fish",
    message: "Köszönjük a vásárlást!",
  },
  issuerName: "SEBESTYÉN MÁTYÁS",
});

// Create szamlazz.hu client
function getClient() {
  const agentKey = process.env.SZAMLAZZ_AGENT_KEY;
  if (!agentKey || agentKey === "your_test_agent_key_here") {
    throw new Error("SZAMLAZZ_AGENT_KEY is not configured");
  }

  return new Client({
    authToken: agentKey,
    eInvoice: false, // Set to true for e-invoice (NAV reporting)
    requestInvoiceDownload: true,
    downloadedInvoiceCount: 1,
    responseVersion: 1,
  });
}

interface InvoiceResult {
  success: boolean;
  invoiceId?: string;
  netTotal?: string;
  grossTotal?: string;
  pdfUrl?: string;
  error?: string;
}

export async function createInvoice(orderData: OrderData): Promise<InvoiceResult> {
  try {
    const client = getClient();

    const useBillingAddress = !orderData.billingAddress?.sameAsShipping;
    const shipping = orderData.shippingAddress;
    const billing = orderData.billingAddress;

    // Build full address string - use shipping address details for building/floor/door
    const addressParts = useBillingAddress
      ? [billing.street, billing.houseNumber]
      : [
          shipping.street,
          shipping.houseNumber,
          shipping.building ? `${shipping.building} ép.` : null,
          shipping.floor ? `${shipping.floor}. em.` : null,
          shipping.door ? `${shipping.door} ajtó` : null,
        ];

    const buyer = new Buyer({
      name: billing?.companyName || (useBillingAddress ? billing.name : shipping.name),
      country: "Magyarország",
      zip: useBillingAddress ? billing.postalCode : shipping.postalCode,
      city: useBillingAddress ? billing.city : shipping.city,
      address: addressParts.filter(Boolean).join(" "),
      taxNumber: billing?.taxNumber || "",
      email: shipping.email,
      sendEmail: true,
      phone: shipping.phone,
      comment: `Rendelésszám: ${orderData.orderId}`,
    });

    // Convert order items to invoice items
    const items = orderData.items.map((item) => {
      const unitPrice = item.product.price + (item.variant?.priceModifier || 0);
      // Prices are stored in cents (fillér), convert to forints
      const unitPriceForints = unitPrice / 100;

      return new Item({
        label: item.variant
          ? `${item.product.name} (${item.variant.name})`
          : item.product.name,
        quantity: item.quantity,
        unit: "db",
        vat: 27, // 27% ÁFA - adjust if you have different VAT rates
        grossUnitPrice: unitPriceForints,
        comment: "",
      });
    });

    // Add shipping cost as an item if applicable
    if (orderData.shippingCost > 0) {
      items.push(
        new Item({
          label: "Szállítási költség",
          quantity: 1,
          unit: "db",
          vat: 27,
          grossUnitPrice: orderData.shippingCost / 100,
          comment: "",
        })
      );
    }

    const invoice = new Invoice({
      paymentMethod: PaymentMethods.Cash, // Készpénz - paid on delivery
      currency: Currencies.Ft,
      language: Languages.Hungarian,
      seller: seller,
      buyer: buyer,
      items: items,
      paid: false, // Utánvét, not paid yet
      comment: `Rendelésszám: ${orderData.orderId}`,
    });

    // Issue the invoice
    const result = await client.issueInvoice(invoice);

    return {
      success: true,
      invoiceId: result.invoiceId,
      netTotal: result.netTotal,
      grossTotal: result.grossTotal,
      pdfUrl: result.pdf ? `data:application/pdf;base64,${result.pdf.toString("base64")}` : undefined,
    };
  } catch (error) {
    console.error("Invoice creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Számla kiállítási hiba",
    };
  }
}

// For testing connection without creating an invoice
export async function testConnection(): Promise<boolean> {
  try {
    getClient();
    return true;
  } catch {
    return false;
  }
}
