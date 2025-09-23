// File: app/api/admin/blog/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Lấy chi tiết một bài viết
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("BlogPosts")
      .select("*")
      .eq("PostID", params.id)
      .single();
    if (error || !data) throw new Error("Không tìm thấy bài viết");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 404 }
    );
  }
}

// Cập nhật một bài viết
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "Admin") {
      return NextResponse.json({ message: "Không được phép" }, { status: 403 });
    }

    const data = await req.formData();
    const imageFile: File | null = data.get("imageFile") as unknown as File;
    let imageUrl = data.get("Image") as string;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updateData: { [key: string]: any } = {
      Title: data.get("Title"),
      Excerpt: data.get("Excerpt"),
      Content: data.get("Content"),
      Category: data.get("Category"),
      Status: data.get("Status"),
    };

    if (imageUrl) {
      updateData.Image = imageUrl;
    }

    const { error } = await supabase
      .from("BlogPosts")
      .update(updateData)
      .eq("PostID", params.id);
    if (error) throw error;

    return NextResponse.json({ message: "Bài viết đã được cập nhật!" });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
  }
}

// Xóa một bài viết
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "Admin") {
      return NextResponse.json({ message: "Không được phép" }, { status: 403 });
    }

    const { error } = await supabase
      .from("BlogPosts")
      .delete()
      .eq("PostID", params.id);
    if (error) throw error;

    return NextResponse.json({ message: "Bài viết đã được xóa!" });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi Server" }, { status: 500 });
  }
}
