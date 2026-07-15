import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const courses = await Course.find({ _id: { $in: user.enrolledCourses } })
      .populate("instructor", "name avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("My learning API error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
