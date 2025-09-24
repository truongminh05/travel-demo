"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

type TourOption = { id: number; title: string };

const GALLERY_CATEGORY_OPTIONS = ["Schedule", "Included Services"] as const;
type GalleryCategory = (typeof GALLERY_CATEGORY_OPTIONS)[number];
const DEFAULT_GALLERY_CATEGORY: GalleryCategory = GALLERY_CATEGORY_OPTIONS[0];

const translateCategory = (value: GalleryCategory) =>
  value === "Schedule" ? "Lịch trình" : "Dịch vụ bao gồm";

type Item = {
  file: File;
  preview: string;
  caption: string;
  content: string;
  category: GalleryCategory;
  scheduleDay: string;
  serviceKey: string;
};

type ScheduleFormItem = {
  dayNumber: string;
  title: string;
  description: string;
};

type InitialDetail = {
  TourID: number;
  Intro: string | null;
  Images?: string[] | null;
  Schedule?: {
    dayNumber?: number | string | null;
    title?: string | null;
    description?: string | null;
  }[];
  IncludedServices?: (string | null)[] | null;
};

export default function AdminTourDetailForm({
  tours,
  initial,
  isEditing = false,
}: {
  tours: TourOption[];
  initial?: InitialDetail;
  isEditing?: boolean;
}) {
  const router = useRouter();
  const [tourId, setTourId] = useState<number>(initial?.TourID || tours[0]?.id);
  const [intro, setIntro] = useState<string>(initial?.Intro || "");
  const [items, setItems] = useState<Item[]>([]);
  const [replaceAll, setReplaceAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleFormItem[]>(
    initial?.Schedule?.length
      ? initial.Schedule.map((item, index) => ({
          dayNumber:
            item?.dayNumber !== undefined && item?.dayNumber !== null
              ? String(item.dayNumber)
              : String(index + 1),
          title: item?.title ?? "",
          description: item?.description ?? "",
        }))
      : []
  );
  const [includedServices, setIncludedServices] = useState<string[]>(
    initial?.IncludedServices && initial.IncludedServices.length
      ? initial.IncludedServices.map((item) => item ?? "")
      : [""]
  );

  const scheduleOptions = useMemo(
    () =>
      scheduleItems.map((entry, index) => {
        const rawDay = (entry.dayNumber ?? "").trim();
        const parsed = Number(rawDay);
        const value =
          Number.isFinite(parsed) && parsed > 0
            ? String(Math.floor(parsed))
            : String(index + 1);
        const title = (entry.title ?? "").trim();
        const label = title ? `Ngày ${value} · ${title}` : `Ngày ${value}`;
        return { value, label };
      }),
    [scheduleItems]
  );

  const serviceOptions = useMemo(
    () =>
      includedServices.map((entry, index) => {
        const value = entry ?? "";
        const label = value ? value : `Mục ${index + 1}`;
        return { value, label, key: `${index}-${value}` };
      }),
    [includedServices]
  );

  useEffect(() => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.category === "Schedule") {
          const exists = scheduleOptions.some(
            (option) => option.value === item.scheduleDay
          );
          if (!exists) {
            const nextValue = scheduleOptions[0]?.value ?? "";
            if (item.scheduleDay !== nextValue) {
              return { ...item, scheduleDay: nextValue };
            }
          }
        } else if (item.category === "Included Services") {
          const exists = serviceOptions.some(
            (option) => option.value === item.serviceKey
          );
          if (!exists) {
            const nextValue = serviceOptions[0]?.value ?? "";
            if (item.serviceKey !== nextValue) {
              return { ...item, serviceKey: nextValue };
            }
          }
        }
        return item;
      })
    );
  }, [scheduleOptions, serviceOptions, setItems]);

  const updateItem = (index: number, changes: Partial<Item>) => {
    setItems((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;
      next[index] = { ...current, ...changes } as Item;
      return next;
    });
  };

  const onFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files ? Array.from(event.target.files) : [];
    const defaultScheduleDay = scheduleOptions[0]?.value ?? "";
    const defaultServiceKey = serviceOptions[0]?.value ?? "";

    const mapped: Item[] = fileList.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      content: "",
      category: DEFAULT_GALLERY_CATEGORY,
      scheduleDay: defaultScheduleDay,
      serviceKey: defaultServiceKey,
    }));
    setItems(mapped);
  };

  const addScheduleItem = () => {
    setScheduleItems((prev) => [
      ...prev,
      {
        dayNumber: String(prev.length + 1),
        title: "",
        description: "",
      },
    ]);
  };

  const onScheduleFieldChange = (
    index: number,
    field: "dayNumber" | "title" | "description",
    value: string
  ) => {
    setScheduleItems((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      if (field === "dayNumber") {
        next[index] = { ...next[index], dayNumber: value };
      } else if (field === "title") {
        next[index] = { ...next[index], title: value };
      } else {
        next[index] = { ...next[index], description: value };
      }
      return next;
    });
  };

  const removeScheduleItem = (index: number) => {
    setScheduleItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addIncludedService = () => {
    setIncludedServices((prev) => [...prev, ""]);
  };

  const onIncludedChange = (index: number, value: string) => {
    setIncludedServices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeIncludedService = (index: number) => {
    setIncludedServices((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.length ? next : [""];
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("TourID", String(tourId));
      formData.append("Intro", intro);
      if (isEditing) formData.append("replaceAll", String(replaceAll));

      const schedulePayload = scheduleItems
        .map((item, index) => {
          const title = item.title.trim();
          const description = item.description.trim();
          const dayValue = item.dayNumber.trim();
          const parsedDay = dayValue ? Number(dayValue) : Number.NaN;
          return {
            dayNumber:
              Number.isFinite(parsedDay) && parsedDay > 0
                ? Math.floor(parsedDay)
                : index + 1,
            title,
            description,
          };
        })
        .filter((entry) => entry.title || entry.description);
      formData.append("schedule", JSON.stringify(schedulePayload));

      const includedPayload = includedServices
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
      formData.append("includedServices", JSON.stringify(includedPayload));

      items.forEach((item) => {
        formData.append("imageFiles", item.file);
        formData.append("captions[]", item.caption || "");
        formData.append("contents[]", item.content || "");
        formData.append("categories[]", item.category);
        formData.append("scheduleDays[]",
          item.category === "Schedule" ? item.scheduleDay : ""
        );
        formData.append("serviceKeys[]",
          item.category === "Included Services" ? item.serviceKey : ""
        );
      });

      const url = isEditing
        ? `/api/admin/tours/details/${tourId}`
        : `/api/admin/tours/details`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, { method, body: formData });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || "Lỗi không xác định");

      alert(json.message || "Thao tác thành công!");
      router.push("/admin/tours");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      alert(message);
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
          onChange={(event) => setTourId(Number(event.target.value))}
        >
          {tours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Giới thiệu tour</Label>
        <Textarea
          rows={4}
          value={intro}
          onChange={(event) => setIntro(event.target.value)}
          placeholder="Giới thiệu tổng quan về gói tour"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Lịch trình (Schedule)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}>
            <Plus className="h-4 w-4 mr-2" /> Thêm ngày
          </Button>
        </div>
        {scheduleItems.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Chưa có ngày nào. Thêm ngày để bắt đầu xây dựng lịch trình.
          </p>
        )}
        <div className="space-y-4">
          {scheduleItems.map((item, index) => (
            <div key={index} className="rounded-md border p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <Label className="text-sm">Ngày</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.dayNumber}
                    onChange={(event) =>
                      onScheduleFieldChange(index, "dayNumber", event.target.value)
                    }
                    placeholder={`${index + 1}`}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label className="text-sm">Tiêu đề</Label>
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      onScheduleFieldChange(index, "title", event.target.value)
                    }
                    placeholder={`Hoạt động ngày ${index + 1}`}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Mô tả chi tiết</Label>
                <Textarea
                  rows={4}
                  value={item.description}
                  onChange={(event) =>
                    onScheduleFieldChange(index, "description", event.target.value)
                  }
                  placeholder="Mô tả nội dung, dịch vụ, hoạt động trong ngày"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeScheduleItem(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Xoá ngày
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Dịch vụ bao gồm</Label>
          <Button type="button" variant="outline" size="sm" onClick={addIncludedService}>
            <Plus className="h-4 w-4 mr-2" /> Thêm dịch vụ
          </Button>
        </div>
        <div className="space-y-3">
          {includedServices.map((service, index) => (
            <div key={index} className="flex items-start gap-3">
              <Input
                value={service}
                onChange={(event) => onIncludedChange(index, event.target.value)}
                placeholder={`Mục ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIncludedService(index)}
                aria-label="Xoá dịch vụ"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ảnh chi tiết & Nội dung tương ứng</Label>
        {isEditing && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <input
              type="checkbox"
              checked={replaceAll}
              onChange={(event) => setReplaceAll(event.target.checked)}
            />
            Thay thế TẤT CẢ ảnh cũ bằng ảnh mới (nếu có tải ảnh)
          </label>
        )}
        <Input type="file" multiple accept="image/*" onChange={onFiles} />

        {items.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {items.map((item, index) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="relative w-full aspect-video rounded overflow-hidden">
                  <Image
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <Label className="text-sm pt-1">Caption (chú thích ngắn)</Label>
                <Input
                  value={item.caption}
                  onChange={(event) => updateItem(index, { caption: event.target.value })}
                  placeholder="VD: Khách sạn 4*, phòng hướng biển"
                />

                <Label className="text-sm">Danh mục</Label>
                <select
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                  value={item.category}
                  onChange={(event) => {
                    const nextCategory = event.target.value as GalleryCategory;
                    updateItem(index, {
                      category: nextCategory,
                      scheduleDay:
                        nextCategory === "Schedule"
                          ? scheduleItems[0]?.dayNumber || ""
                          : item.scheduleDay,
                      serviceKey:
                        nextCategory === "Included Services"
                          ? includedServices[0] || ""
                          : item.serviceKey,
                    });
                  }}
                >
                  {GALLERY_CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {translateCategory(option)}
                    </option>
                  ))}
                </select>

                {item.category === "Schedule" ? (
                  <div className="space-y-1">
                    <Label className="text-sm">Áp dụng cho ngày</Label>
                    {scheduleOptions.length ? (
                      <select
                        className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                        value={item.scheduleDay}
                        onChange={(event) =>
                          updateItem(index, { scheduleDay: event.target.value })
                        }
                      >
                        {scheduleOptions.map((option, optionIndex) => (
                          <option
                            key={`${option.value}-${optionIndex}`}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Thêm lịch trình trước khi liên kết ảnh với ngày cụ thể.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Label className="text-sm">Áp dụng cho dịch vụ</Label>
                    {serviceOptions.length ? (
                      <select
                        className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                        value={item.serviceKey}
                        onChange={(event) =>
                          updateItem(index, { serviceKey: event.target.value })
                        }
                      >
                        {serviceOptions.map((option, optionIndex) => (
                          <option
                            key={option.key ?? `${optionIndex}`}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Thêm dịch vụ bao gồm trước khi liên kết ảnh.
                      </p>
                    )}
                  </div>
                )}

                <Label className="text-sm">Nội dung chi tiết</Label>
                <Textarea
                  rows={4}
                  value={item.content}
                  onChange={(event) => updateItem(index, { content: event.target.value })}
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
