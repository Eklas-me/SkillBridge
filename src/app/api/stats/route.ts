import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import Review from "@/models/Review";

export async function GET() {
  try {
    await dbConnect();
    const [totalCourses, totalStudents, totalInstructors, totalReviews] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: "user" }),
      User.distinct("instructor").then(() => Course.distinct("instructor")).then((r) => r.length),
      Review.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: { totalCourses, totalStudents, totalInstructors, totalReviews },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
