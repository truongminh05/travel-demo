import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BackButton from "@/app/blog/[slug]/back-button";
import TourGalleryTabs from "@/components/tour-gallery-tabs";
import type { GalleryCard } from "@/components/tour-gallery-tabs";


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
  Included: string | null;
};

type GalleryRow = {
  ImageURL: string | null;
  Caption: string | null;
  Content: string | null;
  Category: string | null;
  ScheduleDay: number | null;
  ServiceKey: string | null;
};
type HighlightRow = { HighlightText: string | null };

type ItineraryRow = {
  DayNumber: number | null;
  Title: string | null;
  Description: string | null;
};

type ScheduleItem = {
  day: number;
  title: string;
  description: string;
};

const fmtPrice = (v?: string | number | null) =>
  v == null
    ? ""
    : Number(typeof v === "string" ? parseFloat(v) : v).toLocaleString(
        "vi-VN"
      ) + " đ / người";

type GalleryCategory = "Schedule" | "Included Services";
const DEFAULT_GALLERY_CATEGORY: GalleryCategory = "Schedule";
const ensureGalleryCategory = (value: string | null): GalleryCategory => {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "schedule") return "Schedule";
  if (normalized === "included services") return "Included Services";
  if (normalized === "included") return "Included Services";
  if (normalized === "includedservices") return "Included Services";
  return DEFAULT_GALLERY_CATEGORY;
};

async function getTourBySlug(slug: string) {
  const { data, error } = await supabase
    .from("Tours")
    .select(
      "TourID, TourSlug, Title, Description, Location, Duration, Price, OriginalPrice, Image, CoverImage, Included"
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
    includedText: r.Included ?? "",
  };
}

async function getGallery(tourId: number) {
  const { data } = await supabase
    .from("TourGallery")
    .select("ImageURL, Caption, Content, Category, ScheduleDay, ServiceKey")
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

async function getSchedule(tourId: number) {
  const { data } = await supabase
    .from("TourItinerary")
    .select("DayNumber, Title, Description")
    .eq("TourID", tourId)
    .order("DayNumber", { ascending: true });
  return (data ?? []) as ItineraryRow[];
}

const normalizeSchedule = (rows: ItineraryRow[]): ScheduleItem[] => {
  return rows
    .map((row, index) => {
      const parsedDay = Number(row.DayNumber ?? index + 1);
      const day =
        Number.isFinite(parsedDay) && parsedDay > 0
          ? Math.floor(parsedDay)
          : index + 1;
      const title = (row.Title ?? "").trim();
      const description = (row.Description ?? "").trim();
      return { day, title, description };
    })
    .filter((entry) => entry.title || entry.description);
};

const splitIncludedText = (value: string) =>
  value
    .split(/\r?\n|\r|,/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Next.js 15
  const tour = await getTourBySlug(slug);
  if (!tour) return notFound();

  const [galleryRows, highlights, scheduleRows] = await Promise.all([
    getGallery(tour.id),
    getHighlights(tour.id),
    getSchedule(tour.id),
  ]);

  const schedule = normalizeSchedule(scheduleRows);

  let includedServices = highlights
    .map((item) => item.HighlightText?.trim() || "")
    .filter((text) => text.length > 0);

  if (!includedServices.length && tour.includedText) {
    includedServices = splitIncludedText(tour.includedText);
  }

  const scheduleImages = new Map<number, GalleryCard[]>();
  const serviceImages = new Map<string, GalleryCard[]>();

  galleryRows.forEach((row, index) => {
    const category = ensureGalleryCategory(row.Category);
    const card: GalleryCard = {
      key: `${category}-${index}`,
      image: row.ImageURL || "/placeholder.svg",
      title: row.Caption?.trim() || `Khoảnh khắc ${index + 1}`,
      body: (row.Content || "").trim(),
    };

    if (category === "Schedule" && row.ScheduleDay != null) {
      const day = Number(row.ScheduleDay);
      if (!Number.isFinite(day)) {
        return;
      }
      const target = scheduleImages.get(day) ?? [];
      target.push(card);
      scheduleImages.set(day, target);
    } else if (category === "Included Services") {
      const key = (row.ServiceKey ?? "").trim();
      if (!key) {
        return;
      }
      const target = serviceImages.get(key) ?? [];
      target.push(card);
      serviceImages.set(key, target);
    }
  });

  const scheduleSections = schedule.map((item, index) => {
    const day = item.day > 0 ? item.day : index + 1;
    const images = scheduleImages.get(day) ?? [];
    scheduleImages.delete(day);
    return {
      day,
      title: item.title,
      description: item.description,
      images,
    };
  });

  scheduleImages.forEach((cards, day) => {
    scheduleSections.push({
      day,
      title: "",
      description: "",
      images: cards,
    });
  });
  scheduleSections.sort((a, b) => a.day - b.day);

  const serviceSections = includedServices.map((entry, index) => {
    const value = (entry ?? "").trim();
    const images = value ? serviceImages.get(value) ?? [] : [];
    if (value) {
      serviceImages.delete(value);
    }
    return {
      key: value ? value : `service-${index}`,
      label: value || `Mục ${index + 1}`,
      images,
    };
  });

  serviceImages.forEach((cards, key) => {
    const trimmed = key.trim();
    if (!trimmed) {
      return;
    }
    serviceSections.push({
      key: `extra-${trimmed}`,
      label: trimmed,
      images: cards,
    });
  });

  const hero =
    scheduleSections.find((section) => section.images.length)?.images[0]?.image ||
    serviceSections.find((section) => section.images.length)?.images[0]?.image ||
    tour.cover ||
    tour.image ||
    "/placeholder.svg";

  const hasGallery =
    scheduleSections.some((section) => section.images.length) ||
    serviceSections.some((section) => section.images.length);

  return (
    <div className="min-h-screen bg-background">
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
              <div className="mb-4">
                <BackButton fallback="/tours" />
              </div>
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

      {tour.description && (
        <section className="container mx-auto px-4 max-w-4xl py-8 md:py-10">
          <p className="text-base leading-7 text-muted-foreground whitespace-pre-wrap">
            {tour.description}
          </p>
        </section>
      )}
      {hasGallery && (
        <section className="container mx-auto px-4 py-4 md:py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Chi tiết gói tour
          </h2>
          <p className="text-muted-foreground text-center mt-2 mb-8">
            Hình ảnh minh hoạ cho lịch trình và các dịch vụ đã bao gồm trong tour
          </p>

          <TourGalleryTabs schedule={scheduleSections} services={serviceSections} />
        </section>
      )}

    </div>
  );
}







