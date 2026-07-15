import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";

export async function POST(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;
  try {
    await dbConnect();
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;

    if (tran_id) {
      await Payment.findOneAndUpdate({ transactionId: tran_id }, { status: "cancelled" });
    }
    return NextResponse.redirect(`${baseUrl}/payment/cancel`);
  } catch {
    return NextResponse.redirect(`${baseUrl}/payment/cancel`);
  }
}
