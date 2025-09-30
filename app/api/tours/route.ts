// File: app/api/tours/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "toString" in value) {
    const parsed = Number((value as { toString(): string }).toString());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Xây dựng câu truy vấn dựa trên các tham số từ URL
    let query = supabase
      .from("Tours")
      .select(
        "TourID, TourSlug, Title, Location, Image, Price, OriginalPrice, AverageRating, ReviewCount, Duration, CancellationPolicy, Category, Description" // << Thêm "Category" vào đây
      )
      .eq("Status", "Published");

    const category = searchParams.get("category");
    // Nếu có category và không phải là "all", thêm điều kiện lọc
    if (category && category !== "all") {
      query = query.eq("Category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: `Lỗi truy vấn: ${error.message}` },
        { status: 500 }
      );
    }
    // Lọc theo khoảng giá
    const price_gte = searchParams.get("price_gte");
    const price_lte = searchParams.get("price_lte");
    if (price_gte) query = query.gte("Price", Number(price_gte));
    if (price_lte) query = query.lte("Price", Number(price_lte));

    // Lọc theo địa điểm
    const locations = searchParams.get("locations");
    if (locations) query = query.in("Location", locations.split(","));

    // Lọc theo thời gian
    const durations = searchParams.get("durations");
    if (durations) query = query.in("Duration", durations.split(","));

    // Lọc theo đánh giá tối thiểu
    const rating_gte = searchParams.get("rating_gte");
    if (rating_gte) query = query.gte("AverageRating", Number(rating_gte));

    // Sắp xếp
    const sortBy = searchParams.get("sortBy") || "featured";
    if (sortBy === "price-low")
      query = query.order("Price", { ascending: true });
    if (sortBy === "price-high")
      query = query.order("Price", { ascending: false });
    if (sortBy === "rating")
      query = query.order("AverageRating", {
        ascending: false,
        nullsFirst: false,
      });
    if (sortBy === "featured")
      query = query.order("CreatedAt", { ascending: false });

    // if (error) {
    //   console.error("Supabase error:", error);
    //   return NextResponse.json(
    //     { message: `Lỗi truy vấn: ${error.message}` },
    //     { status: 500 }
    //   );
    // }

    // Map dữ liệu để trả về cho client
    const tours = data.map((tour) => ({
      id: tour.TourID,
      slug: tour.TourSlug,
      title: tour.Title,
      location: tour.Location,
      image: tour.Image,
      price: toNumber(tour.Price),
      originalPrice: toNumber(tour.OriginalPrice),
      rating: toNumber(tour.AverageRating),
      reviewCount: toNumber(tour.ReviewCount),
      duration: tour.Duration,
      cancellation: tour.CancellationPolicy,
      category: tour.Category,
      description: tour.Description,
      highlights: [],
    }));

    return NextResponse.json(tours);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tour:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

