// File: components/admin-blog-form.tsx

"use client";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
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

interface PostData {
  PostID?: number;
  Title: string;
  PostSlug: string;
  Excerpt: string;
  Content: string;
  Category: string;
  Status: string;
  Image: string;
  AuthorName: string; // NEW
  PublishedDate: string;
}

export function AdminBlogForm({
  isEditing = false,
  postData = {},
}: {
  isEditing?: boolean;
  postData?: any;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PostData>({
    Title: "",
    PostSlug: "",
    Excerpt: "",
    Content: "",
    Category: "Travel Guides",
    Status: "Draft",
    Image: "",
    AuthorName: "", // NEW
    PublishedDate: new Date().toISOString().slice(0, 10),
    ...postData,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    postData?.Image || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "Title" && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/[^\w-]+/g, "");
      setFormData((prev) => ({ ...prev, PostSlug: slug }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, Image: "" })); // Xóa ảnh cũ nếu có
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (imageFile) {
      data.append("imageFile", imageFile);
    }

    const apiUrl = isEditing
      ? `/api/admin/blog/${formData.PostID}`
      : "/api/admin/blog";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(apiUrl, { method, body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast({ title: "Thành công!", description: result.message });
      router.push("/admin/blog");
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Title">Tiêu đề</Label>
          <Input
            id="Title"
            name="Title"
            value={formData.Title}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="PostSlug">Slug (URL)</Label>
          <Input
            id="PostSlug"
            name="PostSlug"
            value={formData.PostSlug}
            onChange={handleTextChange}
            required
            disabled={isEditing}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="Excerpt">Đoạn trích ngắn</Label>
        <Textarea
          id="Excerpt"
          name="Excerpt"
          value={formData.Excerpt || ""}
          onChange={handleTextChange}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="Content">Nội dung (hỗ trợ Markdown)</Label>
        <Textarea
          id="Content"
          name="Content"
          value={formData.Content}
          onChange={handleTextChange}
          rows={10}
        />
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="AuthorName">Tên tác giả</Label>
        <Input
          id="AuthorName"
          name="AuthorName"
          value={formData.AuthorName}
          onChange={handleTextChange}
          required
        />
      </div>

      {/* Ngày xuất bản */}
      <div className="space-y-2">
        <Label htmlFor="PublishedDate">Ngày xuất bản</Label>
        <Input
          id="PublishedDate"
          name="PublishedDate"
          type="date"
          value={formData.PublishedDate}
          onChange={handleTextChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Category">Danh mục</Label>
          <Select
            value={formData.Category}
            onValueChange={(v) => setFormData((p) => ({ ...p, Category: v }))}
          >
            <SelectTrigger id="Category">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {BLOG_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="Status">Trạng thái</Label>
          <Select
            name="Status"
            onValueChange={(value) => handleSelectChange("Status", value)}
            value={formData.Status}
          >
            <SelectTrigger id="Status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Bản nháp</SelectItem>
              <SelectItem value="Published">Đã xuất bản</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? "Đang lưu..."
          : isEditing
          ? "Cập nhật bài viết"
          : "Tạo bài viết"}
      </Button>
    </form>
  );
}
