// File: components/admin-tour-form.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

// Định nghĩa kiểu dữ liệu cho formData
interface TourFormData {
  TourID?: number;
  Title: string;
  TourSlug: string;
  Location: string;
  Price: string | number;
  OriginalPrice?: string | number | null;
  Duration: string;
  Category: string;
  Status: string;
  StartDate: string;
  EndDate: string;
  Description: string;
  Image: string;
  [key: string]: any;
}

export function AdminTourForm({
  isEditing = false,
  tourData = {},
}: {
  isEditing?: boolean;
  tourData?: any;
}) {
  const router = useRouter();
  const { toast } = useToast();

  // === THÊM HÀM BỊ THIẾU VÀO ĐÂY ===
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return "";
    try {
      // Chuyển đổi ngày từ CSDL sang định dạng YYYY-MM-DD cho input
      return new Date(dateString).toISOString().split("T")[0];
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return "";
    }
  };

  const [formData, setFormData] = useState<TourFormData>({
    Title: "",
    TourSlug: "",
    Location: "",
    Price: "",
    OriginalPrice: "",
    Duration: "",
    Status: "Draft",
    Description: "",
    Image: "", // Sử dụng 'Image' cho nhất quán
    Category: "Tour trong nước",
    StartDate: formatDateForInput(tourData?.StartDate),
    EndDate: formatDateForInput(tourData?.EndDate),
    ...tourData,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    tourData?.Image || null // Sử dụng 'Image'
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });

    if (imageFile) {
      data.append("imageFile", imageFile);
    }

    const apiUrl = isEditing
      ? `/api/admin/tours/${formData.TourID}`
      : "/api/admin/tours";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method: method,
        body: data,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || `Failed to ${isEditing ? "update" : "create"} tour`
        );
      }
      toast({
        title: "Thành công!",
        description: `Tour đã được ${
          isEditing ? "cập nhật" : "tạo"
        } thành công.`,
      });
      router.push("/admin/tours");
      router.refresh();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {/* Các trường input Title và Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Title">Tên Tour</Label>
          <Input
            id="Title"
            name="Title"
            value={formData.Title || ""}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="TourSlug">Slug (URL)</Label>
          <Input
            id="TourSlug"
            name="TourSlug"
            value={formData.TourSlug || ""}
            onChange={handleTextChange}
            required
            disabled={isEditing}
          />
        </div>
      </div>

      {/* Các trường Location và Description */}
      <div className="space-y-2">
        <Label htmlFor="Location">Địa điểm</Label>
        <Input
          id="Location"
          name="Location"
          value={formData.Location || ""}
          onChange={handleTextChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="Description">Mô tả</Label>
        <Textarea
          id="Description"
          name="Description"
          value={formData.Description || ""}
          onChange={handleTextChange}
          rows={5}
        />
      </div>

      {/* Các trường Price và OriginalPrice */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Price">Giá (VNĐ)</Label>
          <Input
            id="Price"
            name="Price"
            type="number"
            value={formData.Price || ""}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="OriginalPrice">Giá gốc (VNĐ)</Label>
          <Input
            id="OriginalPrice"
            name="OriginalPrice"
            type="number"
            value={formData.OriginalPrice || ""}
            onChange={handleTextChange}
          />
        </div>
      </div>

      {/* Upload ảnh */}
      <div className="grid gap-3">
        <Label htmlFor="ImageFile">Ảnh đại diện</Label>
        <Input
          id="ImageFile"
          name="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="mt-4 relative w-full h-48 border rounded-md overflow-hidden">
            <Image
              src={imagePreview}
              alt="Xem trước"
              layout="fill"
              objectFit="contain"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Các trường Duration, Category, Dates, Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Duration">Thời gian (ví dụ: 3 ngày 2 đêm)</Label>
          <Input
            id="Duration"
            name="Duration"
            type="text"
            value={formData.Duration || ""}
            onChange={handleTextChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Category">Danh mục</Label>
          <Select
            name="Category"
            onValueChange={(value) => handleSelectChange("Category", value)}
            value={formData.Category}
          >
            <SelectTrigger id="Category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tour trong nước">Tour trong nước</SelectItem>
              <SelectItem value="Gói Combo">Gói Combo</SelectItem>
              <SelectItem value="Trải nghiệm">Trải nghiệm</SelectItem>
              <SelectItem value="Tour mạo hiểm">Tour mạo hiểm</SelectItem>
              <SelectItem value="Chuyến đi gia đình">
                Chuyến đi gia đình
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="StartDate">Ngày bắt đầu</Label>
          <Input
            id="StartDate"
            name="StartDate"
            type="date"
            value={formData.StartDate || ""}
            onChange={handleTextChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="EndDate">Ngày kết thúc</Label>
          <Input
            id="EndDate"
            name="EndDate"
            type="date"
            value={formData.EndDate || ""}
            onChange={handleTextChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="Status">Trạng thái</Label>
        <Select
          name="Status"
          onValueChange={(value) => handleSelectChange("Status", value)}
          value={formData.Status}
        >
          <SelectTrigger id="Status">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Draft">Bản nháp</SelectItem>
            <SelectItem value="Published">Đã xuất bản</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang lưu..." : isEditing ? "Cập nhật Tour" : "Tạo Tour"}
      </Button>
    </form>
  );
}
