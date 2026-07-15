import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = await getCurrentUser();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { role } = await req.json();

    if (!["user", "admin", "instructor"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    // Don't allow admin to demote themselves
    if (payload.userId === id) {
      return NextResponse.json({ success: false, message: "You cannot change your own role" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User role updated to ${role}`, data: user });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
