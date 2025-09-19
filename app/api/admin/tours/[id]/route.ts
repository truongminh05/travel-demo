import { NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

// Hàm GET: Lấy thông tin chi tiết của một tour
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await getDbPool();
    const result = await pool
      .request()
      .input("TourID", sql.Int, params.id)
      .query("SELECT * FROM Tours WHERE TourID = @TourID");

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: "Tour not found" }, { status: 404 });
    }
    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu tour ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
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

    if (imageFile && imageFile.size > 0) {
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
      .input("TourID", sql.Int, params.id)
      .input("Title", sql.NVarChar, data.get("Title"))
      .input("Location", sql.NVarChar, data.get("Location"))
      .input("Price", sql.Decimal(10, 2), data.get("Price"))
      .input(
        "OriginalPrice",
        sql.Decimal(10, 2),
        data.get("OriginalPrice") ? data.get("OriginalPrice") : null
      )
      .input("Status", sql.NVarChar, data.get("Status"))
      .input("Image", sql.NVarChar, imageUrl).query(`
        UPDATE Tours 
        SET 
          Title = @Title, Location = @Location, Price = @Price,
          OriginalPrice = @OriginalPrice, Status = @Status, Image = @Image,
          UpdatedAt = GETDATE()
        WHERE TourID = @TourID
      `);

    return NextResponse.json({ message: "Tour đã được cập nhật thành công!" });
  } catch (error) {
    console.error(`Lỗi khi cập nhật tour ID ${params.id}:`, error);
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
    const pool = await getDbPool();
    await pool
      .request()
      .input("TourID", sql.Int, params.id)
      .query("DELETE FROM Tours WHERE TourID = @TourID");

    return NextResponse.json({ message: "Tour đã được xóa thành công!" });
  } catch (error) {
    console.error(`Lỗi khi xóa tour ID ${params.id}:`, error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
