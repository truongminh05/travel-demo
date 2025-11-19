import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { writeFile } from "fs/promises";
import path from "path";

// GET: /api/admin/tours/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.formData();
    const imageFile: File | null = data.get("imageFile") as unknown as File;
    let imageUrl = data.get("Image") as string; // Sử dụng Image

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      const imagePath = path.join(uploadsDir, filename);

      await writeFile(imagePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // const updateData: { [key: string]: any } = {
    //   Title: data.get("Title"),
    //   Location: data.get("Location"), // << Sửa thành Location
    //   Price: Number(data.get("Price")),
    //   OriginalPrice: data.get("OriginalPrice")
    //     ? Number(data.get("OriginalPrice"))
    //     : null,
    //   Status: data.get("Status"),
    //   Image: imageUrl, // << Sửa thành Image
    // };
    const startDate = data.get("StartDate");
    const endDate = data.get("EndDate");
    const updateData: { [key: string]: any } = {
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
    };
    if (imageFile && imageFile.size > 0) {
      updateData.Image = imageUrl;
    }

    const { error } = await supabaseAdmin
      .from("Tours")
      .update(updateData)
      .eq("TourID", id);

    if (error) {
      console.error("PATCH tour error:", error);
      return NextResponse.json(
        { message: `Lỗi khi cập nhật tour: ${error.message}` },
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
  _req: Request,
  context: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await context.params;
  const id = Number(tourId);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ message: "ID tour không hợp lệ" }, { status: 400 });
  }

  try {
    // 1. Không cho xoá nếu tour đã có đơn đặt
    const { count: bookingCount, error: bookingError } = await supabaseAdmin
      .from("Bookings")
      .select("BookingID", { count: "exact", head: true })
      .eq("TourID", id);

    if (bookingError) throw bookingError;

    if ((bookingCount ?? 0) > 0) {
      return NextResponse.json(
        {
          message:
            "Tour này đã có đơn đặt, không thể xoá. Hãy đổi trạng thái tour (ví dụ: inactive/draft) thay vì xoá.",
        },
        { status: 400 }
      );
    }

    // 2. Xoá các bảng phụ dùng TourID
    const tablesToDelete = [
      "Reviews",
      "TourGallery",
      "TourHighlights",
      "TourItinerary",
      "Wishlists",
    ];

    for (const table of tablesToDelete) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("TourID", id);

      if (error) {
        console.error(`[admin/tours] DELETE from ${table} error`, error);
        throw error;
      }
    }

    // 3. Xoá Tour chính
    const { error: deleteTourError } = await supabaseAdmin
      .from("Tours")
      .delete()
      .eq("TourID", id);

    if (deleteTourError) throw deleteTourError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[admin/tours] DELETE error", err);
    return NextResponse.json(
      {
        message: "Không thể xoá tour",
        error: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
