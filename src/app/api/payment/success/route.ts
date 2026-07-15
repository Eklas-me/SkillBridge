import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import Course from "@/models/Course";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;
  try {
    await dbConnect();
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;

    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment) {
      return NextResponse.redirect(`${baseUrl}/payment/fail?error=not_found`);
    }

    payment.status = "completed";
    await payment.save();

    // Enroll user
    await Course.findByIdAndUpdate(payment.course, { $inc: { totalStudents: 1 } });
    await User.findByIdAndUpdate(payment.user, {
      $addToSet: { enrolledCourses: payment.course },
    });

    return NextResponse.redirect(`${baseUrl}/payment/success?tran_id=${tran_id}`);
  } catch (error) {
    console.error("Payment success error:", error);
    return NextResponse.redirect(`${baseUrl}/payment/fail?error=server`);
  }
}
