import AdminTourDetailForm from "@/components/admin-tour-detail-form";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type ToursRow = { TourID: number; Title: string };

async function getTours() {
  const { data, error } = await supabase
    .from("Tours")
    .select("TourID, Title") // ⬅️ bỏ Slug
    .order("Title", { ascending: true });

  if (error) throw new Error(error.message);

  // chuẩn hóa cho form
  return (data ?? []).map((r: ToursRow) => ({
    id: r.TourID,
    title: r.Title,
  }));
}

export default async function NewTourDetailPage() {
  const tours = await getTours();

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Thêm chi tiết tour</h1>
      <AdminTourDetailForm tours={tours} />
    </div>
  );
}
