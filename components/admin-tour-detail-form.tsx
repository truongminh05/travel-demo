"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type TourOption = { id: number; title: string };

// 1. Cập nhật Type: Thêm "content"
type Item = {
  file: File;
  preview: string;
  caption: string;
  content: string; // Thêm trường nội dung
};

export default function AdminTourDetailForm({
  tours,
  initial,
  isEditing = false,
}: {
  tours: TourOption[];
  initial?: { TourID: number; Intro: string | null; Images?: string[] | null };
  isEditing?: boolean;
}) {
  const router = useRouter();
  const [tourId, setTourId] = useState<number>(initial?.TourID || tours[0]?.id);
  const [intro, setIntro] = useState<string>(initial?.Intro || "");
  const [items, setItems] = useState<Item[]>([]);
  const [replaceAll, setReplaceAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const mapped: Item[] = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      caption: "",
      content: "", // 2. Khởi tạo giá trị cho "content"
    }));
    setItems(mapped);
  };

  const onCaptionChange = (idx: number, v: string) => {
    setItems((prev) => {
      const cp = [...prev];
      cp[idx] = { ...cp[idx], caption: v };
      return cp;
    });
  };

  // 3. Thêm hàm onContentChange
  const onContentChange = (idx: number, v: string) => {
    setItems((prev) => {
      const cp = [...prev];
      cp[idx] = { ...cp[idx], content: v };
      return cp;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("TourID", String(tourId));
      fd.append("Intro", intro);
      if (isEditing) fd.append("replaceAll", String(replaceAll));

      // 4. Cập nhật FormData: Thêm "contents[]"
      items.forEach((it) => {
        fd.append("imageFiles", it.file);
        fd.append("captions[]", it.caption || "");
        fd.append("contents[]", it.content || ""); // Thêm nội dung chi tiết
      });

      const url = isEditing
        ? `/api/admin/tours/details/${tourId}`
        : `/api/admin/tours/details`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Lỗi không xác định");

      alert(json.message || "Thao tác thành công!");
      router.push("/admin/tours");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="space-y-2">
        <Label>Chọn tour</Label>
        <select
          className="w-full border h-10 rounded-md px-3 bg-background"
          value={tourId}
          disabled={isEditing}
          onChange={(e) => setTourId(Number(e.target.value))}
        >
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* <div className="space-y-2">
        <Label>Giới thiệu tour</Label>
        <Textarea
          rows={6}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Giới thiệu chung gói tour: khách sạn, phong cảnh, dịch vụ…"
        />
      </div> */}

      <div className="space-y-2">
        <Label>Ảnh chi tiết & Nội dung tương ứng</Label>
        {isEditing && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <input
              type="checkbox"
              checked={replaceAll}
              onChange={(e) => setReplaceAll(e.target.checked)}
            />
            Thay thế TẤT CẢ ảnh cũ bằng ảnh mới (nếu có tải ảnh)
          </label>
        )}
        <Input type="file" multiple accept="image/*" onChange={onFiles} />

        {items.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {items.map((it, i) => (
              <div key={i} className="border rounded-md p-3 space-y-2">
                <div className="relative w-full aspect-video rounded overflow-hidden">
                  <Image
                    src={it.preview}
                    alt={`Preview ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <Label className="text-sm pt-1">Caption (chú thích ngắn)</Label>
                <Input
                  value={it.caption}
                  onChange={(e) => onCaptionChange(i, e.target.value)}
                  placeholder="VD: Khách sạn 4*, phòng hướng biển"
                />

                <Label className="text-sm">Nội dung chi tiết</Label>
                <Textarea
                  rows={4}
                  value={it.content}
                  onChange={(e) => onContentChange(i, e.target.value)} // Sử dụng hàm mới
                  placeholder="Mô tả chi tiết cho ảnh này (dịch vụ/khung cảnh/ưu đãi…)"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? "Đang lưu..."
          : isEditing
          ? "Cập nhật chi tiết tour"
          : "Tạo chi tiết tour"}
      </Button>
    </form>
  );
}
