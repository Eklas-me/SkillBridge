import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ success: false, message: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "ImgBB not configured" }, { status: 500 });
    }

    const uploadForm = new FormData();
    uploadForm.append("image", image);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: uploadForm,
    });

    const data = await res.json();
    if (!data.success) {
      return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: data.data.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
