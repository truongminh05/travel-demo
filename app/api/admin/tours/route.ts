import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Tours")
      .select("TourID, Title, Status, Price, Image,Description")
      .order("CreatedAt", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ message: "Lỗi Supabase" }, { status: 500 });
    }

    const tours = data.map((tour) => ({
      id: tour.TourID,
      Title: tour.Title,
      Status: tour.Status,
      Price: tour.Price,
      Image: tour.Image,
      Description: tour.Description,
    }));

    return NextResponse.json(tours);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tours:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ", error: (error as Error).message },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const imageFile: File | null = data.get("imageFile") as unknown as File;
    let imageUrl = (data.get("Image") as string) || "";

    // Xử lý upload ảnh
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }
    const startDate = data.get("StartDate");
    const endDate = data.get("EndDate");
    // Chuẩn bị dữ liệu
    const insertData = {
      TourSlug: data.get("TourSlug"),
      Title: data.get("Title"),
      Location: data.get("Location"),
      Description: data.get("Description"),
      Price: Number(data.get("Price")),
      Category: data.get("Category"),
      StartDate: startDate ? new Date(startDate as string).toISOString() : null,
      EndDate: endDate ? new Date(endDate as string).toISOString() : null,
      OriginalPrice: data.get("OriginalPrice")
        ? Number(data.get("OriginalPrice"))
        : null,
      Duration: data.get("Duration"),
      Status: data.get("Status"),
      Image: imageUrl,
    };

    // Thực hiện insert
    const { error } = await supabase.from("Tours").insert([insertData]);

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505" || error.message.includes("duplicate")) {
        return NextResponse.json(
          { message: "Tour Slug đã tồn tại. Vui lòng chọn slug khác." },
          { status: 409 }
        );
      }
      return NextResponse.json({ message: "Lỗi tạo tour" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Tour đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo tour:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
