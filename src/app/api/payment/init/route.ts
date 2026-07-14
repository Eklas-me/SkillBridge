import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Payment from "@/models/Payment";
import { getCurrentUser } from "@/lib/auth";
import { SSL_CONFIG } from "@/lib/sslcommerz";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SSLCommerzPayment = require("sslcommerz-lts");

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Please login to enroll" }, { status: 401 });
    }

    await dbConnect();
    const { courseId } = await req.json();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    const tran_id = `TXN_${Date.now()}_${user.userId}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Save pending payment
    await Payment.create({
      user: user.userId,
      course: courseId,
      amount: course.price,
      transactionId: tran_id,
      status: "pending",
    });

    const data = {
      total_amount: course.price,
      currency: "BDT",
      tran_id,
      success_url: `${baseUrl}/api/payment/success`,
      fail_url: `${baseUrl}/api/payment/fail`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      shipping_method: "No",
      product_name: course.title,
      product_category: course.category,
      product_profile: "general",
      cus_name: user.email,
      cus_email: user.email,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
    };

    const sslcz = new SSLCommerzPayment(SSL_CONFIG.store_id, SSL_CONFIG.store_passwd, SSL_CONFIG.is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      return NextResponse.json({ success: true, url: apiResponse.GatewayPageURL });
    }

    return NextResponse.json({ success: false, message: "Payment initialization failed" }, { status: 500 });
  } catch (error) {
    console.error("Payment init error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
