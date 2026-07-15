import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Payment from "@/models/Payment";
import { getCurrentUser } from "@/lib/auth";
import { SSL_CONFIG } from "@/lib/sslcommerz";

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

    const data = new URLSearchParams({
      store_id: SSL_CONFIG.store_id,
      store_passwd: SSL_CONFIG.store_passwd,
      total_amount: course.price.toString(),
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
    });

    const apiUrl = SSL_CONFIG.is_live 
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    const responseData = await apiResponse.json();

    if (responseData?.GatewayPageURL) {
      return NextResponse.json({ success: true, url: responseData.GatewayPageURL });
    }

    return NextResponse.json({ success: false, message: responseData.failedreason || "Payment initialization failed" }, { status: 500 });
  } catch (error: any) {
    console.error("Payment init error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message || String(error) }, { status: 500 });
  }
}
