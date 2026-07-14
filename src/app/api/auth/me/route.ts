import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
