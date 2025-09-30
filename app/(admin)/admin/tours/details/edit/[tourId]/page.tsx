import AdminTourDetailForm from "@/components/admin-tour-detail-form";
import { supabase } from "@/lib/supabaseClient";
import AdminTourGalleryManager, {
  GalleryItem,
} from "@/components/admin-tour-gallery-manager";

export const dynamic = "force-dynamic";

type Tour = {
  TourID: number;
  Title: string;
  Description: string | null;
  Included: string | null;
};
type Gallery = {
  ImageID: number;
  ImageURL: string | null;
  Caption: string | null;
  Content: string | null;
  Category: string | null;
  ScheduleDay: number | null;
  ServiceKey: string | null;
};
type ItineraryRow = {
  DayNumber: number | null;
  Title: string | null;
  Description: string | null;
};
type HighlightRow = { HighlightText: string | null };

async function getTour(tourId: number): Promise<Tour | null> {
  const { data, error } = await supabase
    .from("Tours")
    .select("TourID, Title, Description, Included")
    .eq("TourID", tourId)
    .single();
  if (error) return null;
  return data as Tour;
}

async function getGallery(tourId: number): Promise<Gallery[]> {
  const { data } = await supabase
    .from("TourGallery")
    .select("ImageID, ImageURL, Caption, Content, Category, ScheduleDay, ServiceKey")
    .eq("TourID", tourId)
    .order("ImageID", { ascending: true });
  return (data ?? []) as Gallery[];
}

async function getSchedule(tourId: number): Promise<ItineraryRow[]> {
  const { data } = await supabase
    .from("TourItinerary")
    .select("DayNumber, Title, Description")
    .eq("TourID", tourId)
    .order("DayNumber", { ascending: true });
  return (data ?? []) as ItineraryRow[];
}

async function getIncludedServices(tourId: number): Promise<string[]> {
  const { data } = await supabase
    .from("TourHighlights")
    .select("HighlightText")
    .eq("TourID", tourId)
    .order("HighlightID", { ascending: true });
  const highlights = (data ?? []) as HighlightRow[];
  return highlights
    .map((row) => row.HighlightText?.trim() || "")
    .filter((text) => text.length > 0);
}

export default async function EditTourDetailPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;
  const id = Number(tourId);

  const [tour, gallery, schedule, includedHighlights] = await Promise.all([
    getTour(id),
    getGallery(id),
    getSchedule(id),
    getIncludedServices(id),
  ]);

  if (!tour) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy tour</h1>
        <p className="text-muted-foreground">TourID: {tourId}</p>
      </div>
    );
  }

  const tours = [{ id: tour.TourID, title: tour.Title }];
  const fallbackIncluded = (tour.Included || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const includedServices =
    includedHighlights.length > 0 ? includedHighlights : fallbackIncluded;

  const managerSchedule = schedule.map((item, index) => ({
    day:
      item.DayNumber != null && item.DayNumber > 0 ? item.DayNumber : index + 1,
    title: item.Title ?? "",
    description: item.Description ?? "",
  }));
  const managerServices = includedServices.map((entry) => entry ?? "");

  return (
    <div className="px-6 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa chi tiết tour</h1>
        <div className="text-sm text-muted-foreground">
          Tour: <span className="font-medium">{tour.Title}</span> (ID{" "}
          {tour.TourID})
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <AdminTourDetailForm
            tours={tours}
            isEditing
            initial={{
              TourID: tour.TourID,
              Intro: tour.Description || "",
              Schedule: schedule.map((row) => ({
                dayNumber: row.DayNumber,
                title: row.Title,
                description: row.Description,
              })),
              IncludedServices: includedServices,
            }}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Ảnh chi tiết hiện có</h2>
          <AdminTourGalleryManager
            tourId={id}
            initial={gallery as GalleryItem[]}
            schedule={managerSchedule}
            services={managerServices}
          />
        </div>
      </div>
    </div>
  );
}
