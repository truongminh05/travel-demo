import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { writeFile } from "fs/promises";
import path from "path";

// GET: /api/admin/tours/[id]
export async function GET(
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const id = context.params.id as string;

    const { data, error } = await supabase
      .from("Tours")
      .select("*")
      .eq("TourID", id)
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

// PATCH: cập nhật tour
export async function PATCH(
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const id = context.params.id as string;
    const data = await req.formData();
    const imageFile: File | null = data.get("imageFile") as unknown as File;
    let imageUrl = (data.get("Image") as string) || "";

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
      .eq("TourID", id);

    if (error) {
      console.error("PATCH tour error:", error);
      return NextResponse.json(
        { message: "Lỗi khi cập nhật tour" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Tour đã được cập nhật thành công!" });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

// DELETE: xóa tour
export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const id = context.params.id as string;

    const { error } = await supabase.from("Tours").delete().eq("TourID", id);

    if (error) {
      console.error("DELETE tour error:", error);
      return NextResponse.json(
        { message: "Lỗi khi xóa tour" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Tour đã được xóa thành công!" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
