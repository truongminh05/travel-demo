// File: app/(admin)/admin/tours/page.tsx

"use client"; // << Chuyển thành Client Component

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { PlusCircleIcon } from "lucide-react";
import { AdminTourActions } from "@/components/admin-tour-actions";

// Định nghĩa kiểu dữ liệu cho tour
interface Tour {
  id: number;
  Title: string;
  Status: string;
  Price: number | null;
  Image: string | null;
  Category: string | null;
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const tourCategories = [
    "Tất cả",
    "Tour trong nước",
    "Gói Combo",
    "Trải nghiệm",
    "Tour mạo hiểm",
    "Chuyến đi gia đình",
  ];

  useEffect(() => {
    async function fetchTours() {
      setIsLoading(true);

      let query = supabase
        .from("Tours")
        .select("TourID, Title, Status, Price, Image, Category")
        .order("CreatedAt", { ascending: false });

      if (categoryFilter !== "all" && categoryFilter !== "Tất cả") {
        query = query.eq("Category", categoryFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Lỗi khi lấy dữ liệu Supabase:", error);
        setTours([]);
      } else if (data) {
        const mappedData = data.map((tour) => ({ ...tour, id: tour.TourID }));
        setTours(mappedData);
      }
      setIsLoading(false);
    }

    fetchTours();
  }, [categoryFilter]); // Fetch lại dữ liệu mỗi khi bộ lọc thay đổi

  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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
          <div className="flex items-center gap-4">
            {/* Bộ lọc Danh mục */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                {tourCategories.map((cat) => (
                  <SelectItem key={cat} value={cat === "Tất cả" ? "all" : cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button size="sm" className="gap-1" asChild>
              <Link href="/admin/tours/new">
                <PlusCircleIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Thêm Tour
                </span>
              </Link>
            </Button>
          </div>
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
              <TableHead>Danh mục</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>
                <span className="sr-only">Hành động</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : tours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không tìm thấy tour nào.
                </TableCell>
              </TableRow>
            ) : (
              tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={tour.Title || "Ảnh tour"}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={tour.Image || "/placeholder.svg"}
                      width="64"
                      unoptimized
                    />
                  </TableCell>
                  <TableCell className="font-medium">{tour.Title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tour.Category || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tour.Status === "Published" ? "default" : "outline"
                      }
                    >
                      {tour.Status}
                    </Badge>
                  </TableCell>
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
