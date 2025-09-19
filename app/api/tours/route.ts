import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Tours")
      .select(
        `
        TourID, TourSlug, Title, Location, Image, Price, OriginalPrice, 
        AverageRating, ReviewCount, Duration, CancellationPolicy, CO2Impact
      `
      )
      .eq("Status", "Published");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Lỗi truy vấn Supabase" },
        { status: 500 }
      );
    }

    const tours = data.map((tour) => ({
      id: tour.TourID,
      slug: tour.TourSlug,
      title: tour.Title,
      location: tour.Location,
      image: tour.Image,
      price: tour.Price,
      originalPrice: tour.OriginalPrice,
      rating: tour.Rating,
      reviewCount: tour.ReviewCount,
      duration: tour.Duration,
      cancellation: tour.CancellationPolicy,
      co2Impact: tour.CO2Impact,
      highlights: [], // TODO: Lấy từ bảng TourHighlights nếu cần
    }));

    return NextResponse.json(tours);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tour:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ", error: (error as Error).message },
      { status: 500 }
    );
  }
}
