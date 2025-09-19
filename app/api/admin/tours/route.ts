import { NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT TourID, Title, Status, Price, Image 
      FROM Tours ORDER BY CreatedAt DESC
    `);

    // Chuyển đổi từ PascalCase sang camelCase
    const tours = result.recordset.map((tour) => ({
      id: tour.TourID,
      Title: tour.Title, // Giữ PascalCase nếu trang admin đang dùng
      Status: tour.Status,
      Price: tour.Price,
      Image: tour.Image,
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

    // Xử lý tải file ảnh
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const imagePath = path.join(uploadsDir, filename);

      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const pool = await getDbPool();
    await pool
      .request()
      .input("TourSlug", sql.NVarChar, data.get("TourSlug"))
      .input("Title", sql.NVarChar, data.get("Title"))
      .input("Location", sql.NVarChar, data.get("Location"))
      .input("Description", sql.NVarChar, data.get("Description"))
      .input("Image", sql.NVarChar, imageUrl)
      .input("Price", sql.Decimal(10, 2), data.get("Price"))
      .input(
        "OriginalPrice",
        sql.Decimal(10, 2),
        data.get("OriginalPrice") ? data.get("OriginalPrice") : null
      )
      .input("Duration", sql.NVarChar, data.get("Duration"))
      .input("CancellationPolicy", sql.NVarChar, data.get("CancellationPolicy"))
      .input("CO2Impact", sql.NVarChar, data.get("CO2Impact"))
      .input(
        "MaxGuests",
        sql.Int,
        data.get("MaxGuests") ? data.get("MaxGuests") : null
      )
      .input("MinAge", sql.Int, data.get("MinAge") ? data.get("MinAge") : null)
      .input("Difficulty", sql.NVarChar, data.get("Difficulty"))
      .input(
        "DepartureDate",
        sql.Date,
        data.get("DepartureDate") ? data.get("DepartureDate") : null
      )
      .input("Status", sql.NVarChar, data.get("Status")).query(`
        INSERT INTO Tours (
          TourSlug, Title, Location, Description, Image, Price, OriginalPrice, 
          Duration, CancellationPolicy, CO2Impact, MaxGuests, MinAge, 
          Difficulty, DepartureDate, Status
        ) 
        VALUES (
          @TourSlug, @Title, @Location, @Description, @Image, @Price, @OriginalPrice,
          @Duration, @CancellationPolicy, @CO2Impact, @MaxGuests, @MinAge,
          @Difficulty, @DepartureDate, @Status
        )
      `);

    return NextResponse.json(
      { message: "Tour đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tạo tour:", error);
    if (
      error instanceof sql.RequestError &&
      error.message.includes("UNIQUE KEY constraint")
    ) {
      return NextResponse.json(
        { message: "Tour Slug đã tồn tại. Vui lòng chọn một slug khác." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
