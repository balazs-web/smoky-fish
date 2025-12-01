import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmails, type OrderData } from "@/lib/email-service";

// Generate a unique order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MS-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { items, subtotal, shippingCost, totalPrice, shippingAddress, billingAddress } = body;

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
    };

    // Send emails
    const emailResults = await sendOrderEmails(orderData);

    // TODO: Save order to Firebase if needed
    // await saveOrderToFirebase(orderData);

    return NextResponse.json({
      success: true,
      orderId: orderData.orderId,
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
