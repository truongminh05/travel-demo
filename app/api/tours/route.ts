// File: app/api/admin/tours/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Lấy danh sách tour cho admin (bảng quản lý tour)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const idParam = url.searchParams.get("id");
    const selectFields = `
  TourID,
  TourSlug,
  Title,
  Status,
  Price,
  OriginalPrice,
  Location,
  Duration,
  Image,
  Category,
  Description,
  StartDate,
  EndDate,
  CreatedAt,
  AverageRating,
  ReviewCount
`;

    if (idParam && Number.isNaN(Number(idParam))) {
      return NextResponse.json({ message: "Invalid tour id" }, { status: 400 });
    }

    if (slug || idParam) {
      let query = supabaseAdmin.from("Tours").select(selectFields);
      if (slug) {
        query = query.eq("TourSlug", slug);
      }
      if (idParam) {
        query = query.eq("TourID", Number(idParam));
      }
      const { data, error } = await query.maybeSingle();
      if (error) {
        console.error("[ADMIN TOURS][GET] Supabase error:", error);
        return NextResponse.json(
          { message: "Lỗi khi lấy tour", supabaseError: error },
          { status: 500 }
        );
      }
      return NextResponse.json(data ?? null, { status: 200 });
    }

    const { data, error } = await supabaseAdmin
      .from("Tours")
      .select(selectFields)
      .order("CreatedAt", { ascending: false });

    if (error) {
      console.error("[ADMIN TOURS][GET] Supabase error:", error);
      return NextResponse.json(
        { message: "Lỗi khi lấy danh sách tour", supabaseError: error },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (err) {
    console.error("[ADMIN TOURS][GET] Server error:", err);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ", error: (err as Error).message },
      { status: 500 }
    );
  }
}

// Thêm tour mới từ form admin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      Title,
      TourSlug,
      Price,
      OriginalPrice,
      Location,
      Duration,
      Image,
      Category,
      Description,
      Status,
    } = body;

    if (!Title || !TourSlug) {
      return NextResponse.json(
        { message: "Thiếu Title hoặc TourSlug" },
        { status: 400 }
      );
    }

    const insertData: any = {
      Title,
      TourSlug,
      Price: Price ?? 0,
      OriginalPrice: OriginalPrice ?? null,
      Location: Location ?? null,
      Duration: Duration ?? null,
      Image: Image ?? null,
      Category: Category ?? null,
      Description: Description ?? null,
      Status: Status ?? "Draft",
    };

    const { data, error } = await supabaseAdmin
      .from("Tours")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("[ADMIN TOURS][POST] Supabase insert error:", error);
      return NextResponse.json(
        {
          message: "Lỗi khi thêm tour",
          supabaseError: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[ADMIN TOURS][POST] Server error:", err);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ", error: (err as Error).message },
      { status: 500 }
    );
  }
}
