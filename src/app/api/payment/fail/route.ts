import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;

    if (tran_id) {
      await Payment.findOneAndUpdate({ transactionId: tran_id }, { status: "failed" });
    }
    return NextResponse.redirect(`${baseUrl}/payment/fail`);
  } catch {
    return NextResponse.redirect(`${baseUrl}/payment/fail`);
  }
}
