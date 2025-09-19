import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { writeFile } from "fs/promises";
import path from "path";

// GET: /api/tours/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("Tours")
      .select("*")
      .eq("TourID", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET tour error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Hàm PATCH: Cập nhật thông tin của một tour
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.formData();
    const imageFile: File | null = data.get("imageFile") as unknown as File;
    let imageUrl = (data.get("Image") as string) || "";

    // Upload ảnh nếu có file mới
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updateData = {
      Title: data.get("Title"),
      Location: data.get("Location"),
      Price: Number(data.get("Price")),
      OriginalPrice: data.get("OriginalPrice")
        ? Number(data.get("OriginalPrice"))
        : null,
      Status: data.get("Status"),
      Image: imageUrl,
      UpdatedAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("Tours")
      .update(updateData)
      .eq("TourID", params.id);

    if (error) {
      console.error("PATCH tour error:", error);
      return NextResponse.json(
        { message: "Lỗi khi cập nhật tour" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Tour đã được cập nhật thành công!" });
  } catch (error) {
    console.error(`Lỗi PATCH tour ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

// Hàm DELETE: Xóa một tour
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from("Tours")
      .delete()
      .eq("TourID", params.id);

    if (error) {
      console.error("DELETE tour error:", error);
      return NextResponse.json(
        { message: "Lỗi khi xóa tour" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Tour đã được xóa thành công!" });
  } catch (error) {
    console.error(`Lỗi khi xóa tour ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
