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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("BlogPosts")
      .select("*")
      .eq("PostID", id)
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "Admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const form = await req.formData();

    // 1) Ảnh: nếu có file mới -> lưu; nếu không -> dùng Image gửi từ form (ảnh cũ)
    const file = form.get("imageFile") as File | null;
    let imageUrl = (form.get("Image") as string) || ""; // giữ ảnh cũ khi không upload mới

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const fullPath = path.join(uploadsDir, filename);
      await writeFile(fullPath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // 2) PublishedDate: cho phép giữ nguyên nếu không gửi
    const publishedDateStr = (form.get("PublishedDate") as string) || "";
    const publishedDate =
      publishedDateStr.trim() !== ""
        ? new Date(`${publishedDateStr}T00:00:00Z`).toISOString()
        : undefined; // undefined -> không đổi

    // 3) Tạo payload cập nhật (THÊM AuthorName)
    const payload: Record<string, any> = {
      Title: form.get("Title"),
      PostSlug: form.get("PostSlug"),
      Excerpt: form.get("Excerpt"),
      Content: form.get("Content"),
      Category: form.get("Category"),
      Status: form.get("Status"),
      AuthorName: form.get("AuthorName"), // <--- QUAN TRỌNG
      UpdatedAt: new Date().toISOString(),
    };

    if (imageUrl) payload.Image = imageUrl;
    if (publishedDate !== undefined) payload.PublishedDate = publishedDate;

    // loại bỏ key rỗng/undefined để tránh set null ngoài ý muốn
    Object.keys(payload).forEach((k) => {
      const v = payload[k];
      if (
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "")
      ) {
        delete payload[k];
      }
    });

    const { data, error } = await supabase
      .from("BlogPosts")
      .update(payload)
      .eq("PostID", Number(id))
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Cập nhật bài viết thành công",
      post: data,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Server error" },
      { status: 500 }
    );
  }
}
