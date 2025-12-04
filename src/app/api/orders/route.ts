import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmails, type OrderData } from "@/lib/email-service";
// import { createInvoice } from "@/lib/invoice-service"; // DISABLED
import { saveOrder } from "@/lib/order-service";
import { DELIVERY_POSTCODES } from "@/config/deliveryPostcodes";

// Generate a unique order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MS-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { items, subtotal, shippingCost, totalPrice, shippingAddress, billingAddress, paymentMethod } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "A kosár üres" },
        { status: 400 }
      );
    }

    if (!shippingAddress?.name || !shippingAddress?.email || !shippingAddress?.phone) {
      return NextResponse.json(
        { error: "Hiányzó szállítási adatok" },
        { status: 400 }
      );
    }

    // Validate shipping postcode against allowed delivery areas
    const shippingPostcode = shippingAddress?.postalCode;
    if (!shippingPostcode || shippingPostcode.length !== 4 || !(shippingPostcode in DELIVERY_POSTCODES)) {
      return NextResponse.json(
        { error: "Erre az irányítószámra nem szállítunk. Csak Budapest és Pest megye területére szállítunk." },
        { status: 400 }
      );
    }

    // Generate order data
    const orderData: OrderData = {
      orderId: generateOrderId(),
      items,
      subtotal: subtotal || totalPrice,
      shippingCost: shippingCost || 0,
      totalPrice,
      shippingAddress,
      billingAddress,
      orderDate: new Date(),
      paymentMethod,
    };

    // DISABLED: szamlazz.hu invoice integration temporarily disabled
    // To re-enable, uncomment the createInvoice import and the block below:
    // let invoiceResult = null;
    // try {
    //   invoiceResult = await createInvoice(orderData);
    //   if (invoiceResult.success) {
    //     console.log(`Invoice created: ${invoiceResult.invoiceId}`);
    //   } else {
    //     console.warn(`Invoice creation failed: ${invoiceResult.error}`);
    //   }
    // } catch (invoiceError) {
    //   console.error("Invoice creation error:", invoiceError);
    // }

    // Save order to Firebase (without sensitive customer data)
    try {
      await saveOrder(orderData, undefined, paymentMethod);
      console.log(`Order saved to Firebase: ${orderData.orderId}`);
    } catch (saveError) {
      console.error("Failed to save order to Firebase:", saveError);
      // Don't fail the order if Firebase save fails
    }

    // Send emails
    const emailResults = await sendOrderEmails(orderData);

    return NextResponse.json({
      success: true,
      orderId: orderData.orderId,
      invoiceId: null,
      emailResults,
      message: "Rendelés sikeresen leadva!",
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Hiba történt a rendelés feldolgozása során" },
      { status: 500 }
    );
  }
}
