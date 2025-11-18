// File: app/api/admin/blog/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Lấy danh sách bài viết
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("BlogPosts")
      .select("PostID, Title, Status, CreatedAt, Image")
      .order("CreatedAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi Server khi lấy bài viết" },
      { status: 500 }
    );
  }
}

// Tạo bài viết mới
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "Admin") {
      return NextResponse.json({ message: "Không được phép" }, { status: 403 });
    }

    const form = await request.formData();
    const file = form.get("imageFile") as File | null;
    let imageUrl = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const publishedDateStr = (form.get("PublishedDate") as string) || "";
    // chuẩn hóa về ISO (00:00:00 theo UTC)
    const publishedDate = publishedDateStr
      ? new Date(`${publishedDateStr}T00:00:00Z`).toISOString()
      : new Date().toISOString();

    const tagsValue = (form.get("Tags") as string) ?? "";
    const tagsArray = tagsValue
      ? tagsValue
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const { error } = await supabaseAdmin.from("BlogPosts").insert([
      {
        Title: form.get("Title"),
        PostSlug: form.get("PostSlug"),
        Excerpt: form.get("Excerpt"),
        Content: form.get("Content"),
        Image: imageUrl,
        AuthorName: form.get("AuthorName"),
        Category: form.get("Category"),
        Status: form.get("Status"),
        PublishedDate: publishedDate,
        AuthorID: (session.user as any)?.id,
        Tags: tagsArray,
        CreatedAt: new Date().toISOString(),
      },
    ]);

    if (error) {
      // xử lý duplicate slug (nếu bạn có unique index)
      if ((error as any).code === "23505") {
        return NextResponse.json(
          { message: "Slug đã tồn tại" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Bài viết đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Lỗi Server khi tạo bài viết" },
      { status: 500 }
    );
  }
}
