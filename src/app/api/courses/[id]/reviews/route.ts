import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Course from "@/models/Course";
import { getCurrentUser } from "@/lib/auth";

// POST /api/courses/:id/reviews
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Please login to submit a review" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ success: false, message: "Rating and comment are required" }, { status: 400 });
    }

    // Check for existing review
    const existing = await Review.findOne({ user: user.userId, course: id });
    if (existing) {
      return NextResponse.json({ success: false, message: "You have already reviewed this course" }, { status: 409 });
    }

    const review = await Review.create({ user: user.userId, course: id, rating, comment });
    await review.populate("user", "name avatar");

    // Update course average rating
    const allReviews = await Review.find({ course: id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Course.findByIdAndUpdate(id, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    return NextResponse.json({ success: true, message: "Review submitted", data: review }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
