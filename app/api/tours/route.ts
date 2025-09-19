import { NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool.request().query(`
      SELECT 
        TourID, TourSlug, Title, Location, Image, Price, OriginalPrice, 
        Rating, ReviewCount, Duration, CancellationPolicy, CO2Impact
      FROM Tours 
      WHERE Status = 'Published'
    `);

    // Chuyển đổi từ PascalCase sang camelCase
    const tours = result.recordset.map((tour) => ({
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
      highlights: [], // Bạn có thể thêm logic để lấy highlights ở đây
    }));

    return NextResponse.json(tours);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tours công khai:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
