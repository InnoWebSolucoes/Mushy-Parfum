import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json({ error: "Phone and amount required" }, { status: 400 });
    }

    // Simulate MB Way processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate fake reference
    const reference = `MW${Date.now().toString().slice(-8)}`;

    return NextResponse.json({
      success: true,
      reference,
      message: "Payment request sent to MB Way app",
      expiresIn: 300, // 5 minutes
    });
  } catch {
    return NextResponse.json({ error: "MB Way request failed" }, { status: 500 });
  }
}
