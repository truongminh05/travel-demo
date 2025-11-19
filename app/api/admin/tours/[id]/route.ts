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
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);

  if (!Number.isFinite(id)) {
    return NextResponse.json(
      { message: "ID tour không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    // 1. Lấy danh sách BookingID của tour này (nếu có)
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("Bookings")
      .select("BookingID")
      .eq("TourID", id);

    if (bookingsError) throw bookingsError;

    const bookingIds = (bookings ?? [])
      .map((b: any) => b.BookingID)
      .filter((x: any) => x != null);

    // 2. Xoá bảng phụ theo TourID
    const byTourTables = [
      "Wishlists",
      "TourGallery",
      "TourHighlights",
      "TourItinerary",
    ] as const;

    for (const table of byTourTables) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("TourID", id);

      if (error) {
        console.error(`[admin/tours] DELETE from ${table} error`, error);
        throw error;
      }
    }

    // 3. Xoá Reviews
    if (bookingIds.length > 0) {
      const orFilter = `TourID.eq.${id},BookingID.in.(${bookingIds.join(",")})`;

      const { error: reviewError } = await supabaseAdmin
        .from("Reviews")
        .delete()
        .or(orFilter);

      if (reviewError) {
        console.error("[admin/tours] DELETE Reviews error", reviewError);
        throw reviewError;
      }
    } else {
      const { error: reviewError } = await supabaseAdmin
        .from("Reviews")
        .delete()
        .eq("TourID", id);

      if (reviewError) {
        console.error("[admin/tours] DELETE Reviews error", reviewError);
        throw reviewError;
      }
    }

    // 4. Nếu có booking thì xoá Payments rồi Bookings
    if (bookingIds.length > 0) {
      const { error: payError } = await supabaseAdmin
        .from("Payments")
        .delete()
        .in("BookingID", bookingIds);

      if (payError) {
        console.error("[admin/tours] DELETE Payments error", payError);
        throw payError;
      }

      const { error: delBookingError } = await supabaseAdmin
        .from("Bookings")
        .delete()
        .eq("TourID", id);

      if (delBookingError) {
        console.error("[admin/tours] DELETE Bookings error", delBookingError);
        throw delBookingError;
      }
    }

    // 5. Cuối cùng xoá Tour
    const { error: tourError } = await supabaseAdmin
      .from("Tours")
      .delete()
      .eq("TourID", id);

    if (tourError) {
      console.error("[admin/tours] DELETE Tours error", tourError);
      throw tourError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[admin/tours] DELETE exception", err);
    return NextResponse.json(
      {
        message: "Không thể xoá tour",
        error: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
