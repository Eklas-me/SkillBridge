import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import Payment from "@/models/Payment";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Calculate total revenue from completed payments
    const payments = await Payment.find({ status: "completed" });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    const [totalCourses, totalUsers, totalAdmins, recentPayments] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "admin" }),
      Payment.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").populate("courses", "title"),
    ]);

    return NextResponse.json({
      success: true,
      data: { 
        totalCourses, 
        totalUsers, 
        totalAdmins, 
        totalRevenue,
        recentPayments
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
