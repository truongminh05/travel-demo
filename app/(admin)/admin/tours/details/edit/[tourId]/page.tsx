import AdminTourDetailForm from "@/components/admin-tour-detail-form";
import { supabase } from "@/lib/supabaseClient";
import AdminTourGalleryManager, {
  GalleryItem,
} from "@/components/admin-tour-gallery-manager";

export const dynamic = "force-dynamic";

type Tour = { TourID: number; Title: string; Description: string | null };
type Gallery = {
  ImageID: number;
  ImageURL: string | null;
  Caption: string | null;
  Content: string | null;
};

async function getTour(tourId: number): Promise<Tour | null> {
  const { data, error } = await supabase
    .from("Tours")
    .select("TourID, Title, Description")
    .eq("TourID", tourId)
    .single();
  if (error) return null;
  return data as Tour;
}

async function getGallery(tourId: number): Promise<Gallery[]> {
  const { data } = await supabase
    .from("TourGallery")
    .select("ImageID, ImageURL, Caption, Content")
    .eq("TourID", tourId)
    .order("ImageID", { ascending: true });
  return (data ?? []) as Gallery[];
}

export default async function EditTourDetailPage({
  params,
}: {
  params: { tourId: string };
}) {
  const { tourId } = await params;
  const id = Number(tourId);

  const [tour, gallery] = await Promise.all([getTour(id), getGallery(id)]);

  if (!tour) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-2">Không tìm thấy tour</h1>
        <p className="text-muted-foreground">TourID: {params.tourId}</p>
      </div>
    );
  }

  const tours = [{ id: tour.TourID, title: tour.Title }];

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa chi tiết tour</h1>
        <div className="text-sm text-muted-foreground">
          Tour: <span className="font-medium">{tour.Title}</span> (ID{" "}
          {tour.TourID})
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <AdminTourDetailForm
            tours={tours}
            isEditing
            initial={{ TourID: tour.TourID, Intro: tour.Description || "" }}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Ảnh chi tiết hiện có</h2>
          <AdminTourGalleryManager
            tourId={id}
            initial={gallery as GalleryItem[]}
          />
        </div>
      </div>
    </div>
  );
}
