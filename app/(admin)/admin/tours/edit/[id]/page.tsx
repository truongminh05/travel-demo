import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AdminTourForm } from "@/components/admin-tour-form";

// Hàm lấy dữ liệu chi tiết của tour từ API
async function getTourDetails(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL chưa được cấu hình");

  const res = await fetch(`${apiUrl}/api/admin/tours/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Không thể tải dữ liệu chi tiết của tour");
  }
  return res.json();
}

// ✅ Page Component (Next.js 15.5.3)
export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 👇 Bắt buộc phải await trong 15.5.3
  const { id } = await params;

  const tourData = await getTourDetails(id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Tour</CardTitle>
        <CardDescription>
          Update the details of the tour package below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminTourForm isEditing={true} tourData={tourData} />
      </CardContent>
    </Card>
  );
}
