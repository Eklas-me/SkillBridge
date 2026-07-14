import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Review from "@/models/Review";
import { getCurrentUser } from "@/lib/auth";

// GET /api/courses/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const course = await Course.findById(id).populate("instructor", "name avatar email");
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    const reviews = await Review.find({ course: id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .limit(20);

    // Related courses — same category, exclude current
    const related = await Course.find({ category: course.category, _id: { $ne: id } })
      .limit(4)
      .populate("instructor", "name avatar");

    return NextResponse.json({ success: true, data: course, reviews, related });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PUT /api/courses/:id — update (owner only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    if (course.instructor.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const updated = await Course.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json({ success: true, message: "Course updated", data: updated });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/courses/:id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    if (course.instructor.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await Course.findByIdAndDelete(id);
    await Review.deleteMany({ course: id });

    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
