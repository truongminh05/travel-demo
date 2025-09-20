// File: app/(admin)/admin/tours/page.tsx

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

async function getAdminTours() {
  try {
    const { data, error } = await supabase
      .from("Tours")
      .select("TourID, Title, Status, Price, Image")
      .order("CreatedAt", { ascending: false });

    if (error) {
      console.error("Lỗi khi lấy dữ liệu Supabase:", error);
      return [];
    }

    return data.map((tour) => ({
      id: tour.TourID,
      Title: tour.Title,
      Status: tour.Status,
      Price: tour.Price,
      Image: tour.Image,
    }));
  } catch (error) {
    console.error("Lỗi kết nối Supabase:", error);
    return [];
  }
}

// Thêm hàm format tiền tệ
const formatCurrency = (value: number | null) => {
  if (value === null || typeof value === "undefined") return "N/A";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default async function AdminToursPage() {
  const tours = await getAdminTours();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý Tour</CardTitle>
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
                Ảnh
              </TableHead>
              <TableHead>Tên Tour</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>
                <span className="sr-only">Hành động</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy tour nào.
                </TableCell>
              </TableRow>
            ) : (
              tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="hidden sm:table-cell">
                    {/* === THAY ĐỔI: Sử dụng đường dẫn tương đối trực tiếp === */}
                    <Image
                      alt={tour.Title || "Ảnh tour"}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      // Đường dẫn gốc "/uploads/..." là đủ để trình duyệt hiểu
                      src={tour.Image || "/placeholder.svg"}
                      width="64"
                      // Thêm prop unoptimized để tránh lỗi với các đường dẫn tương đối trên Vercel
                      unoptimized
                    />
                  </TableCell>
                  <TableCell className="font-medium">{tour.Title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tour.Status === "Published" ? "default" : "outline"
                      }
                    >
                      {tour.Status}
                    </Badge>
                  </TableCell>
                  {/* Cập nhật hiển thị giá tiền */}
                  <TableCell>{formatCurrency(tour.Price)}</TableCell>
                  <TableCell>
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
