import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

// GET /api/courses — list with search, filter, sort, pagination
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 99999;
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(24, Number(searchParams.get("limit")) || 12);

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {
      price: { $gte: minPrice, $lte: maxPrice },
    };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (level) filter.level = level;

    // Build sort
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortObj: Record<string, any> = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    else if (sort === "price_desc") sortObj = { price: -1 };
    else if (sort === "rating") sortObj = { rating: -1 };
    else if (sort === "popular") sortObj = { totalStudents: -1 };

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate("instructor", "name avatar"),
      Course.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST /api/courses — create (protected)
const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  shortDescription: z.string().min(10).max(250),
  fullDescription: z.string().min(20),
  price: z.number().min(0),
  category: z.string().min(1),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  image: z.string().url().optional().or(z.literal("")),
  duration: z.string().optional(),
  lessons: z.number().optional(),
  language: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: Admins only" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const result = courseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const course = await Course.create({
      ...result.data,
      instructor: user.userId,
    });

    return NextResponse.json(
      { success: true, message: "Course created successfully", data: course },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
