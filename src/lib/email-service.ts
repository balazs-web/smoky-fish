import nodemailer from "nodemailer";
import type { BasketItem, ShippingAddress, BillingAddress } from "@/contexts/BasketContext";
import { fetchSiteConfig } from "@/lib/siteService";

// Email configuration from environment variables
const smtpPort = parseInt(process.env.SMTP_PORT || "465");
const smtpConfig = {
  host: process.env.SMTP_HOST || "mail.smoky-fish.hu",
  port: smtpPort,
  secure: true, // SSL required for port 465
  auth: {
    user: process.env.SMTP_USER || "info@smoky-fish.hu",
    pass: process.env.SMTP_PASSWORD || "",
  },
  tls: {
    // Accept self-signed certificates
    rejectUnauthorized: false,
  },
  // Connection settings for better reliability
  connectionTimeout: 15000, // 15 seconds
  greetingTimeout: 15000,
  socketTimeout: 20000,
};

const shopManagerEmail = process.env.SHOP_MANAGER_EMAIL || "info@smoky-fish.hu";
const fromEmail = process.env.SMTP_USER || "info@smoky-fish.hu";

// Create transporter on demand for better connection handling
const createTransporter = () => nodemailer.createTransport(smtpConfig);

// Send email with retry logic
async function sendMailWithRetry(
  mailOptions: nodemailer.SendMailOptions,
  retries = 2
): Promise<void> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail(mailOptions);
      transporter.close();
      return;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Email attempt ${attempt + 1} failed:`, (error as Error).message);
      if (attempt < retries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
}

export type PaymentMethodType = "card" | "transfer" | "cod";

export interface OrderData {
  orderId: string;
  items: BasketItem[];
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  orderDate: Date;
  paymentMethod?: PaymentMethodType;
}

// Payment method labels in Hungarian
const paymentMethodLabels: Record<PaymentMethodType, string> = {
  card: "Bankkártya",
  transfer: "Átutalás",
  cod: "Utánvétel",
};

// Format price from cents to HUF string
const formatPrice = (priceInCents: number): string => {
  return (priceInCents / 100).toLocaleString("hu-HU") + " Ft";
};

// Generate order items HTML table
const generateOrderItemsHtml = (items: BasketItem[]): string => {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
          ${item.product.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">
          ${formatPrice(item.product.price)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">
          ${formatPrice(item.product.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color: #F5F3EF;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #C89A63;">Termék</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #C89A63;">Mennyiség</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #C89A63;">Egységár</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #C89A63;">Összesen</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

// Generate address HTML
const generateAddressHtml = (
  address: ShippingAddress,
  title: string
): string => {
  return `
    <div style="background-color: #F5F3EF; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h3 style="margin: 0 0 12px 0; color: #1B5E4B;">${title}</h3>
      <p style="margin: 4px 0;"><strong>${address.name}</strong></p>
      <p style="margin: 4px 0;">${address.postalCode} ${address.city}</p>
      <p style="margin: 4px 0;">${address.street} ${address.houseNumber}${address.floor ? `, ${address.floor}. emelet` : ""}${address.door ? `, ${address.door}. ajtó` : ""}</p>
      <p style="margin: 4px 0;">Tel: ${address.phone}</p>
      <p style="margin: 4px 0;">Email: ${address.email}</p>
      ${address.note ? `<p style="margin: 8px 0 0 0; font-style: italic; color: #666;">Megjegyzés: ${address.note}</p>` : ""}
    </div>
  `;
};

// Generate billing address HTML
const generateBillingHtml = (
  billing: BillingAddress,
  shipping: ShippingAddress
): string => {
  if (billing.sameAsShipping) {
    return `
      <div style="background-color: #F5F3EF; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1B5E4B;">Számlázási cím</h3>
        <p style="margin: 4px 0; color: #666;">Megegyezik a szállítási címmel</p>
      </div>
    `;
  }

  return `
    <div style="background-color: #F5F3EF; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h3 style="margin: 0 0 12px 0; color: #1B5E4B;">Számlázási cím</h3>
      ${billing.companyName ? `<p style="margin: 4px 0;"><strong>${billing.companyName}</strong></p>` : ""}
      ${billing.taxNumber ? `<p style="margin: 4px 0;">Adószám: ${billing.taxNumber}</p>` : ""}
      <p style="margin: 4px 0;"><strong>${billing.name}</strong></p>
      <p style="margin: 4px 0;">${billing.postalCode} ${billing.city}</p>
      <p style="margin: 4px 0;">${billing.street} ${billing.houseNumber}</p>
    </div>
  `;
};

// Customer order confirmation email
export async function sendCustomerOrderConfirmation(
  order: OrderData,
  shopName: string = "Matyistore"
): Promise<boolean> {
  const orderDateStr = order.orderDate.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background-color: #C89A63; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; color: #000; font-size: 24px;">${shopName}</h1>
        <p style="margin: 8px 0 0 0; color: #000;">Grúz finomságok Magyarországon</p>
      </div>
      
      <!-- Content -->
      <div style="background-color: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none;">
        
        <h2 style="color: #1B5E4B; margin-top: 0;">Köszönjük a rendelésed! 🎉</h2>
        
        <p>Kedves <strong>${order.shippingAddress.name}</strong>,</p>
        
        <p>Megkaptuk a rendelésedet és hamarosan feldolgozzuk. Az alábbiakban találod a rendelés részleteit:</p>
        
        <!-- Order Info -->
        <div style="background-color: #1B5E4B; color: #fff; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Rendelésszám:</strong> ${order.orderId}</p>
          <p style="margin: 8px 0 0 0;"><strong>Rendelés dátuma:</strong> ${orderDateStr}</p>
        </div>
        
        <!-- Order Items -->
        <h3 style="color: #1B5E4B;">Rendelt termékek</h3>
        ${generateOrderItemsHtml(order.items)}
        
        <!-- Price Summary -->
        <div style="background-color: #F5F3EF; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Részösszeg:</span>
            <span>${formatPrice(order.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Szállítási költség:</span>
            <span>${order.shippingCost === 0 ? '<span style="color: #1B5E4B; font-weight: bold;">Ingyenes!</span>' : formatPrice(order.shippingCost)}</span>
          </div>
        </div>
        
        <!-- Total -->
        <div style="text-align: right; padding: 16px; background-color: #1B5E4B; color: #fff; border-radius: 8px;">
          <span style="font-size: 18px;"><strong>Végösszeg: ${formatPrice(order.totalPrice)}</strong></span>
        </div>
        
        <!-- Payment Method -->
        ${order.paymentMethod ? `
        <div style="background-color: #F5F3EF; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #1B5E4B;">Fizetési mód</h3>
          <p style="margin: 0; font-weight: bold;">${paymentMethodLabels[order.paymentMethod]}</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">Megjegyzés: Egyes termékek jellegéből adódóan (pl. tömeg alapú árazás) a végső ár kis mértékben eltérhet. A csomagolás után értesítünk a pontos összegről.</p>
        </div>
        ` : ''}
        
        <!-- Addresses -->
        ${generateAddressHtml(order.shippingAddress, "Szállítási cím")}
        ${generateBillingHtml(order.billingAddress, order.shippingAddress)}
        
        <!-- Footer Message -->
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p>Ha bármilyen kérdésed van a rendeléssel kapcsolatban, kérlek vedd fel velünk a kapcsolatot:</p>
          <p>📧 <a href="mailto:info@smoky-fish.hu" style="color: #1B5E4B;">info@smoky-fish.hu</a></p>
        </div>
        
      </div>
      
      <!-- Footer -->
      <div style="background-color: #F5F3EF; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
        <p style="margin: 0;">© ${new Date().getFullYear()} ${shopName} - Minden jog fenntartva</p>
      </div>
      
    </body>
    </html>
  `;

  try {
    await sendMailWithRetry({
      from: `"${shopName}" <${fromEmail}>`,
      to: order.shippingAddress.email,
      subject: `Rendelés visszaigazolás - #${order.orderId}`,
      html,
    });
    console.log(`Customer confirmation email sent to ${order.shippingAddress.email}`);
    return true;
  } catch (error) {
    console.error("Failed to send customer email after retries:", error);
    return false;
  }
}

// Shop manager new order notification email
export async function sendShopManagerNotification(
  order: OrderData,
  shopName: string = "Matyistore"
): Promise<boolean> {
  const orderDateStr = order.orderDate.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background-color: #1B5E4B; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; color: #fff; font-size: 24px;">🛒 Új rendelés érkezett!</h1>
      </div>
      
      <!-- Content -->
      <div style="background-color: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none;">
        
        <!-- Order Info -->
        <div style="background-color: #C89A63; color: #000; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0;"><strong>Rendelésszám:</strong> ${order.orderId}</p>
          <p style="margin: 8px 0 0 0;"><strong>Dátum:</strong> ${orderDateStr}</p>
          <p style="margin: 8px 0 0 0;"><strong>Ügyfél:</strong> ${order.shippingAddress.name}</p>
          <p style="margin: 8px 0 0 0;"><strong>Email:</strong> ${order.shippingAddress.email}</p>
          <p style="margin: 8px 0 0 0;"><strong>Telefon:</strong> ${order.shippingAddress.phone}</p>
        </div>
        
        <!-- Order Items -->
        <h3 style="color: #1B5E4B;">Rendelt termékek</h3>
        ${generateOrderItemsHtml(order.items)}
        
        <!-- Price Summary -->
        <div style="background-color: #F5F3EF; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Részösszeg:</span>
            <span>${formatPrice(order.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Szállítási költség:</span>
            <span>${order.shippingCost === 0 ? '<strong style="color: #1B5E4B;">Ingyenes</strong>' : formatPrice(order.shippingCost)}</span>
          </div>
        </div>
        
        <!-- Total -->
        <div style="text-align: right; padding: 16px; background-color: #1B5E4B; color: #fff; border-radius: 8px; margin-bottom: 20px;">
          <span style="font-size: 20px;"><strong>Végösszeg: ${formatPrice(order.totalPrice)}</strong></span>
        </div>
        
        <!-- Payment Method -->
        ${order.paymentMethod ? `
        <div style="background-color: #C89A63; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0;"><strong>Fizetési mód:</strong> ${paymentMethodLabels[order.paymentMethod]}</p>
        </div>
        ` : ''}
        
        <!-- Addresses -->
        ${generateAddressHtml(order.shippingAddress, "Szállítási cím")}
        ${generateBillingHtml(order.billingAddress, order.shippingAddress)}
        
      </div>
      
      <!-- Footer -->
      <div style="background-color: #F5F3EF; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
        <p style="margin: 0;">${shopName} Admin Értesítés</p>
      </div>
      
    </body>
    </html>
  `;

  try {
    await sendMailWithRetry({
      from: `"${shopName} Rendszer" <${fromEmail}>`,
      to: shopManagerEmail,
      subject: `🛒 Új rendelés - #${order.orderId} - ${formatPrice(order.totalPrice)}`,
      html,
    });
    console.log(`Shop manager notification sent to ${shopManagerEmail}`);
    return true;
  } catch (error) {
    console.error("Failed to send shop manager email after retries:", error);
    return false;
  }
}

// Send both emails for an order
export async function sendOrderEmails(order: OrderData): Promise<{
  customerEmailSent: boolean;
  managerEmailSent: boolean;
}> {
  // Fetch the shop name from site config
  let shopName = "Matyistore";
  try {
    const siteConfig = await fetchSiteConfig();
    shopName = siteConfig.storeName || "Matyistore";
  } catch (error) {
    console.warn("Could not fetch site config for shop name, using default:", error);
  }

  const [customerEmailSent, managerEmailSent] = await Promise.all([
    sendCustomerOrderConfirmation(order, shopName),
    sendShopManagerNotification(order, shopName),
  ]);

  return { customerEmailSent, managerEmailSent };
}
