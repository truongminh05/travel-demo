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

// Định nghĩa kiểu dữ liệu cho formData để code an toàn hơn
interface TourFormData {
  TourID?: number;
  Title: string;
  TourSlug: string;
  Location: string;
  Price: string | number;
  OriginalPrice?: string | number | null;
  Duration: string;
  Status: string;
  Description: string;
  Image: string;
  [key: string]: any; // Cho phép các thuộc tính khác
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
  const [formData, setFormData] = useState<TourFormData>({
    Title: "",
    TourSlug: "",
    Location: "",
    Price: "",
    OriginalPrice: "",
    Duration: "",
    Status: "Draft",
    Description: "",
    Image: "",
    CancellationPolicy: "none",
    CO2Impact: "low",
    MaxGuests: "",
    MinAge: "",
    Difficulty: "Moderate",
    DepartureDate: "",
    ...tourData,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    tourData?.Image || null
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
        title: "Success!",
        description: `Tour has been successfully ${
          isEditing ? "updated" : "created"
        }.`,
      });
      router.push("/admin/tours");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
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
          <Label htmlFor="Title">Tour Title</Label>
          <Input
            id="Title"
            name="Title"
            value={formData.Title}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="TourSlug">Tour Slug (URL)</Label>
          <Input
            id="TourSlug"
            name="TourSlug"
            value={formData.TourSlug}
            onChange={handleTextChange}
            required
            disabled={isEditing}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="Location">Location</Label>
        <Input
          id="Location"
          name="Location"
          value={formData.Location}
          onChange={handleTextChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="Description">Description</Label>
        <Textarea
          id="Description"
          name="Description"
          value={formData.Description}
          onChange={handleTextChange}
          rows={5}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Price">Price ($)</Label>
          <Input
            id="Price"
            name="Price"
            type="number"
            value={formData.Price}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="OriginalPrice">Original Price ($)</Label>
          <Input
            id="OriginalPrice"
            name="OriginalPrice"
            type="number"
            value={String(formData.OriginalPrice ?? "")}
            onChange={handleTextChange}
          />
        </div>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="ImageFile">Tour Image</Label>
        <Input
          id="ImageFile"
          name="imageFile"
          type="file"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="mt-4 relative w-full h-48 border rounded-md overflow-hidden">
            <Image
              src={imagePreview}
              alt="Image preview"
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Duration">Duration</Label>
          <Input
            id="Duration"
            name="Duration"
            value={formData.Duration}
            onChange={handleTextChange}
          />
        </div>

        {/* === Ô STATUS ĐÃ ĐƯỢC THÊM LẠI Ở ĐÂY === */}
        <div className="space-y-2">
          <Label htmlFor="Status">Status</Label>
          <Select
            name="Status"
            onValueChange={(value) => handleSelectChange("Status", value)}
            value={formData.Status}
          >
            <SelectTrigger id="Status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : isEditing ? "Update Tour" : "Create Tour"}
      </Button>
    </form>
  );
}
