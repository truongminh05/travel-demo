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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/tours/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    // Ném lỗi sẽ kích hoạt error.tsx của Next.js, giúp gỡ lỗi tốt hơn
    throw new Error("Không thể tải dữ liệu chi tiết của tour");
  }
  return res.json();
}

// THÊM "async" vào đây là bước quan trọng nhất
export default async function EditTourPage({
  params,
}: {
  params: { id: string };
}) {
  const tourData = await getTourDetails(params.id);

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
