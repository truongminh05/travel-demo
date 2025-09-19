import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { PlusCircleIcon } from "lucide-react";
import { AdminTourActions } from "@/components/admin-tour-actions";

// Hàm lấy dữ liệu tour trực tiếp từ CSDL, chạy trên server
async function getAdminTours() {
  try {
    const { data, error } = await supabase
      .from("Tours")
      .select("TourID, Title, Status, Price, CoverImage")
      .order("CreatedAt", { ascending: false });

    if (error) {
      console.error("Lỗi khi lấy dữ liệu Supabase:", error);
      return [];
    }

    // Đổi tên fields cho đúng với logic render UI
    return data.map((tour) => ({
      id: tour.TourID,
      Title: tour.Title,
      Status: tour.Status,
      Price: tour.Price,
      Image: tour.CoverImage,
    }));
  } catch (error) {
    console.error("Lỗi kết nối Supabase:", error);
    return [];
  }
}

export default async function AdminToursPage() {
  const tours = await getAdminTours();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tours</CardTitle>
            <CardDescription>
              Quản lý các tour và xem hiệu suất bán hàng của chúng.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" asChild>
            <Link href="/admin/tours/new">
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Thêm Tour
              </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                Image
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tours found.
                </TableCell>
              </TableRow>
            ) : (
              tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={tour.Title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={tour.Image || "/placeholder.svg"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{tour.Title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tour.Status}</Badge>
                  </TableCell>
                  <TableCell>${tour.Price}</TableCell>
                  <TableCell>
                    {/* Component này chứa các nút Sửa/Xóa */}
                    <AdminTourActions tourId={tour.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
