// File: app/api/admin/blog/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Lấy danh sách bài viết
export async function GET() {
  try {
    const { data, error } = await supabase
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

    const data = await request.formData();
    const imageFile: File | null = data.get("imageFile") as unknown as File;
    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const postData = {
      Title: data.get("Title"),
      PostSlug: data.get("PostSlug"),
      Excerpt: data.get("Excerpt"),
      Content: data.get("Content"),
      Category: data.get("Category"),
      Status: data.get("Status"),
      Image: imageUrl,
      AuthorID: (session.user as any)?.id,
    };

    const { error } = await supabase.from("BlogPosts").insert([postData]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Slug của bài viết này đã tồn tại." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Bài viết đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi Server khi tạo bài viết" },
      { status: 500 }
    );
  }
}
