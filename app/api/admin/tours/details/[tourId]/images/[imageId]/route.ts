import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
// Nếu có next-auth, mở 2 dòng dưới và check role Admin như trước
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { tourId: string; imageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "Admin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const tourId = Number(params.tourId);
  const imageId = Number(params.imageId);
  if (!tourId || !imageId)
    return NextResponse.json({ message: "Invalid params" }, { status: 400 });

  const { error } = await supabase
    .from("TourGallery")
    .delete()
    .eq("TourID", tourId)
    .eq("ImageID", imageId);

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: "Đã xoá ảnh" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { tourId: string; imageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "Admin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const tourId = Number(params.tourId);
  const imageId = Number(params.imageId);
  if (!tourId || !imageId)
    return NextResponse.json({ message: "Invalid params" }, { status: 400 });

  try {
    const form = await req.formData();
    const caption = form.get("Caption") as string | null;
    const content = form.get("Content") as string | null;
    const file = form.get("imageFile") as File | null;

    const updateData: Record<string, any> = {};
    if (typeof caption === "string") updateData.Caption = caption;
    if (typeof content === "string") updateData.Content = content;

    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadsDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      await writeFile(path.join(uploadsDir, filename), buffer);
      updateData.ImageURL = `/uploads/${filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "Không có gì để cập nhật" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("TourGallery")
      .update(updateData)
      .eq("TourID", tourId)
      .eq("ImageID", imageId);

    if (error) throw error;
    return NextResponse.json({ message: "Đã cập nhật ảnh" });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
