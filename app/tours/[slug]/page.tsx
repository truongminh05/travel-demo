import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type ToursRow = {
  TourID: number;
  TourSlug: string;
  Title: string;
  Description: string | null;
  Location: string | null;
  Duration: string | null;
  Price: string | number | null;
  OriginalPrice: string | number | null;
  Image: string | null;
  CoverImage: string | null;
};

type GalleryRow = {
  [x: string]: string | null;
  ImageURL: string | null;
  Caption: string | null;
  Content: string | null;
};
type HighlightRow = { HighlightText: string | null };

const fmtPrice = (v?: string | number | null) =>
  v == null
    ? ""
    : Number(typeof v === "string" ? parseFloat(v) : v).toLocaleString(
        "vi-VN"
      ) + " đ / người";

async function getTourBySlug(slug: string) {
  const { data, error } = await supabase
    .from("Tours")
    .select(
      "TourID, TourSlug, Title, Description, Location, Duration, Price, OriginalPrice, Image, CoverImage"
    )
    .eq("TourSlug", slug)
    .single();

  if (error || !data) return null;
  const r = data as ToursRow;
  return {
    id: r.TourID,
    slug: r.TourSlug,
    title: r.Title,
    description: r.Description ?? "",
    location: r.Location ?? "",
    duration: r.Duration ?? "",
    price: r.Price,
    originalPrice: r.OriginalPrice,
    image: r.Image ?? null,
    cover: r.CoverImage ?? null,
  };
}

async function getGallery(tourId: number) {
  const { data } = await supabase
    .from("TourGallery")
    .select("ImageURL, Caption, Content")
    .eq("TourID", tourId)
    .order("ImageID", { ascending: true });
  return (data ?? []) as GalleryRow[];
}

async function getHighlights(tourId: number) {
  const { data } = await supabase
    .from("TourHighlights")
    .select("HighlightText")
    .eq("TourID", tourId)
    .order("HighlightID", { ascending: true });
  return (data ?? []) as HighlightRow[];
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Next.js 15
  const tour = await getTourBySlug(slug);
  if (!tour) return notFound();

  const [gallery, highlights] = await Promise.all([
    getGallery(tour.id),
    getHighlights(tour.id),
  ]);

  // Ảnh hero ưu tiên ảnh đầu của gallery -> CoverImage -> Image
  const hero =
    gallery[0]?.ImageURL || tour.cover || tour.image || "/placeholder.svg";

  // Tạo "thẻ chi tiết gói tour" (ảnh + tiêu đề + mô tả)
  // Ghép lần lượt ảnh gallery với highlight tương ứng; fallback caption/description
  const featureCards = gallery.map((g, i) => ({
    image: g.ImageURL || "/placeholder.svg",
    title: g.Caption?.trim() || `Khoảnh khắc ${i + 1}`,
    body: (g.Content || "").trim(), // nếu muốn chỉ hiển thị 1 dòng, dùng title thôi
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* HERO: ảnh mờ giống blog */}
      <section className="relative w-full">
        <div className="relative h-[260px] md:h-[360px] lg:h-[420px] overflow-hidden">
          <Image
            src={hero}
            alt={tour.title}
            fill
            priority
            className="object-cover scale-105 blur-sm brightness-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent" />
        </div>

        <div className="absolute inset-0">
          <div className="container mx-auto h-full px-4 flex items-end">
            <div className="w-full max-w-4xl pb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                {tour.title}
              </h1>
              <p className="mt-2 text-white/90">
                {tour.location ? `${tour.location} · ` : ""}
                {tour.duration ? `${tour.duration} · ` : ""}
                {fmtPrice(tour.price)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GIỚI THIỆU NGẮN (tuỳ chọn) */}
      {/* {tour.description && (
        <section className="container mx-auto px-4 max-w-4xl py-8 md:py-10">
          <p className="text-base leading-7 text-muted-foreground whitespace-pre-wrap">
            {tour.description}
          </p>
        </section>
      )} */}

      {/* CHI TIẾT GÓI TOUR – Lưới thẻ giống bố cục category */}
      <section className="container mx-auto px-4 py-4 md:py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Chi tiết gói tour
        </h2>
        <p className="text-muted-foreground text-center mt-2 mb-8">
          Những trải nghiệm, dịch vụ và khung cảnh nổi bật trong hành trình
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((f, idx) => (
            <Card
              key={idx}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={f.image}
                  alt={f.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                {f.body && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {f.body}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* (tuỳ chọn) LỊCH TRÌNH / DỊCH VỤ BAO GỒM — có thể thêm dưới đây nếu muốn */}
    </div>
  );
}
