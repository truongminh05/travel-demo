
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";

const GALLERY_CATEGORY_OPTIONS = ["Schedule", "Included Services"] as const;
type GalleryCategory = (typeof GALLERY_CATEGORY_OPTIONS)[number];
const DEFAULT_GALLERY_CATEGORY: GalleryCategory = GALLERY_CATEGORY_OPTIONS[0];

const translateCategory = (value: GalleryCategory) =>
  value === "Schedule" ? "Lịch trình" : "Dịch vụ bao gồm";

const normaliseCategory = (value: string | null | undefined): GalleryCategory => {
  const normalized = (value ?? "").trim().toLowerCase();
  if (normalized === "schedule") return "Schedule";
  if (normalized === "included services") return "Included Services";
  if (normalized === "included") return "Included Services";
  if (normalized === "includedservices") return "Included Services";
  return DEFAULT_GALLERY_CATEGORY;
};

export type GalleryItem = {
  ImageID: number;
  ImageURL: string | null;
  Caption: string | null;
  Content: string | null;
  Category: string | null;
  ScheduleDay: number | null;
  ServiceKey: string | null;
};

type GalleryStateItem = {
  ImageID: number;
  ImageURL: string | null;
  Caption: string | null;
  Content: string | null;
  Category: GalleryCategory;
  ScheduleDay: number | null;
  ServiceKey: string | null;
};

type ScheduleOption = {
  day: number;
  title: string;
  description: string;
};
export default function AdminTourGalleryManager({
  tourId,
  initial,
  schedule,
  services,
}: {
  tourId: number;
  initial: GalleryItem[];
  schedule: ScheduleOption[];
  services: string[];
}) {
  const { toast } = useToast();

  const scheduleOptions = useMemo(
    () =>
      schedule.map((entry, index) => {
        const parsed = Number(entry.day);
        const day =
          Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : index + 1;
        const title = (entry.title ?? "").trim();
        const description = (entry.description ?? "").trim();
        const label = title ? `Ngày ${day} · ${title}` : `Ngày ${day}`;
        return { day, title, description, label };
      }),
    [schedule]
  );

  const serviceOptions = useMemo(
    () =>
      services
        .map((entry, index) => {
          const value = (entry ?? "").trim();
          if (!value) return null;
          return {
            key: `${index}-${value}`,
            value,
            label: value,
          };
        })
        .filter(
          (
            option
          ): option is { key: string; value: string; label: string } => option !== null
        ),
    [services]
  );

  const [items, setItems] = useState<GalleryStateItem[]>(() =>
    initial.map((item) => ({
      ImageID: item.ImageID,
      ImageURL: item.ImageURL,
      Caption: item.Caption,
      Content: item.Content,
      Category: normaliseCategory(item.Category),
      ScheduleDay: item.ScheduleDay ?? null,
      ServiceKey: item.ServiceKey ?? null,
    }))
  );
  const [activeTab, setActiveTab] =
    useState<GalleryCategory>(DEFAULT_GALLERY_CATEGORY);
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<number | null>(
    scheduleOptions[0]?.day ?? null
  );
  const [selectedServiceKey, setSelectedServiceKey] = useState<string | null>(
    serviceOptions[0]?.value ?? null
  );
  const [editing, setEditing] = useState<GalleryStateItem | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createPreviewURL, setCreatePreviewURL] = useState<string | null>(null);
  const [createCaption, setCreateCaption] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createCategory, setCreateCategory] =
    useState<GalleryCategory>(DEFAULT_GALLERY_CATEGORY);
  const [createScheduleDay, setCreateScheduleDay] = useState<number | null>(
    scheduleOptions[0]?.day ?? null
  );
  const [createServiceKey, setCreateServiceKey] = useState<string | null>(
    serviceOptions[0]?.value ?? null
  );
  const [createSaving, setCreateSaving] = useState(false);
  useEffect(() => {
    if (!scheduleOptions.length) {
      setSelectedScheduleDay(null);
      return;
    }
    setSelectedScheduleDay((prev) => {
      if (prev == null) {
        return scheduleOptions[0].day;
      }
      const exists = scheduleOptions.some((option) => option.day === prev);
      return exists ? prev : scheduleOptions[0].day;
    });
  }, [scheduleOptions]);

  useEffect(() => {
    if (!serviceOptions.length) {
      setSelectedServiceKey(null);
      return;
    }
    setSelectedServiceKey((prev) => {
      if (prev == null) {
        return serviceOptions[0].value;
      }
      const exists = serviceOptions.some((option) => option.value === prev);
      return exists ? prev : serviceOptions[0].value;
    });
  }, [serviceOptions]);

  useEffect(() => {
    return () => {
      if (createPreviewURL) {
        URL.revokeObjectURL(createPreviewURL);
      }
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [createPreviewURL, previewURL]);

  const scheduleCounts = useMemo(() => {
    const map = new Map<number, number>();
    items.forEach((item) => {
      if (item.Category === "Schedule" && item.ScheduleDay != null) {
        map.set(item.ScheduleDay, (map.get(item.ScheduleDay) ?? 0) + 1);
      }
    });
    return map;
  }, [items]);

  const serviceCounts = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      if (item.Category === "Included Services" && item.ServiceKey) {
        map.set(item.ServiceKey, (map.get(item.ServiceKey) ?? 0) + 1);
      }
    });
    return map;
  }, [items]);

  const scheduleItemsForSelected = useMemo(
    () =>
      items.filter(
        (item) =>
          item.Category === "Schedule" &&
          item.ScheduleDay != null &&
          item.ScheduleDay === selectedScheduleDay
      ),
    [items, selectedScheduleDay]
  );

  const serviceItemsForSelected = useMemo(
    () =>
      items.filter(
        (item) =>
          item.Category === "Included Services" &&
          item.ServiceKey &&
          item.ServiceKey === selectedServiceKey
      ),
    [items, selectedServiceKey]
  );

  const activeSchedule = useMemo(
    () =>
      selectedScheduleDay == null
        ? undefined
        : scheduleOptions.find((option) => option.day === selectedScheduleDay),
    [scheduleOptions, selectedScheduleDay]
  );

  const activeService = useMemo(
    () =>
      selectedServiceKey == null
        ? undefined
        : serviceOptions.find((option) => option.value === selectedServiceKey),
    [serviceOptions, selectedServiceKey]
  );
  const resetCreateForm = () => {
    if (createPreviewURL) {
      URL.revokeObjectURL(createPreviewURL);
    }
    setCreatePreviewURL(null);
    setCreateFile(null);
    setCreateCaption("");
    setCreateContent("");
  };

  const closeCreate = () => {
    resetCreateForm();
    setCreateOpen(false);
  };

  const openCreate = (
    category: GalleryCategory,
    context?: { day?: number; serviceKey?: string }
  ) => {
    if (category === "Schedule" && !scheduleOptions.length) {
      toast({
        title: "Thiếu lịch trình",
        description: "Vui lòng thêm lịch trình trước khi tải ảnh.",
        variant: "destructive",
      });
      return;
    }
    if (category === "Included Services" && !serviceOptions.length) {
      toast({
        title: "Thiếu dịch vụ",
        description: "Vui lòng thêm dịch vụ bao gồm trước khi tải ảnh.",
        variant: "destructive",
      });
      return;
    }

    resetCreateForm();
    if (category === "Schedule") {
      const targetDay =
        context?.day ??
        (selectedScheduleDay &&
        scheduleOptions.some((option) => option.day === selectedScheduleDay)
          ? selectedScheduleDay
          : null) ??
        scheduleOptions[0]?.day ??
        null;
      setCreateScheduleDay(targetDay);
      setCreateServiceKey(null);
    } else {
      const targetKey =
        context?.serviceKey ??
        (selectedServiceKey &&
        serviceOptions.some((option) => option.value === selectedServiceKey)
          ? selectedServiceKey
          : null) ??
        serviceOptions[0]?.value ??
        null;
      setCreateServiceKey(targetKey);
      setCreateScheduleDay(null);
    }
    setCreateCategory(category);
    setCreateOpen(true);
  };

  const closeEdit = () => {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setPreviewURL(null);
    setPreviewFile(null);
    setEditing(null);
  };

  const openEdit = (item: GalleryStateItem) => {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setEditing({ ...item });
    setPreviewFile(null);
    setPreviewURL(null);
  };
  const submitCreate = async () => {
    if (!createFile) {
      toast({
        title: "Thiếu ảnh",
        description: "Vui lòng chọn ảnh trước khi lưu.",
        variant: "destructive",
      });
      return;
    }

    if (createCategory === "Schedule") {
      if (createScheduleDay == null) {
        toast({
          title: "Thiếu ngày",
          description: "Chọn ngày lịch trình cho ảnh này.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const key = (createServiceKey ?? "").trim();
      if (!key) {
        toast({
          title: "Thiếu dịch vụ",
          description: "Chọn dịch vụ đi kèm cho ảnh này.",
          variant: "destructive",
        });
        return;
      }
    }

    setCreateSaving(true);
    try {
      const formData = new FormData();
      formData.append("imageFile", createFile);
      formData.append("Caption", createCaption);
      formData.append("Content", createContent);
      formData.append("Category", createCategory);
      if (createCategory === "Schedule") {
        formData.append("ScheduleDay", String(createScheduleDay));
      } else {
        formData.append("ServiceKey", (createServiceKey ?? "").trim());
      }

      const response = await fetch(
        `/api/admin/tours/details/${tourId}/images`,
        { method: "POST", body: formData }
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || "Create failed");

      const inserted = json?.item as GalleryItem | undefined;
      if (!inserted) {
        throw new Error("Không nhận được dữ liệu ảnh mới");
      }

      setItems((prev) => [
        ...prev,
        {
          ImageID: inserted.ImageID,
          ImageURL: inserted.ImageURL,
          Caption: inserted.Caption,
          Content: inserted.Content,
          Category: normaliseCategory(inserted.Category),
          ScheduleDay: inserted.ScheduleDay ?? null,
          ServiceKey: inserted.ServiceKey ?? null,
        },
      ]);

      toast({ title: "Đã thêm", description: "Ảnh mới đã được tạo." });
      closeCreate();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể tạo ảnh mới";
      toast({ title: "Lỗi", description: message, variant: "destructive" });
    } finally {
      setCreateSaving(false);
    }
  };

  const submitEdit = async () => {
    if (!editing) return;

    if (editing.Category === "Schedule") {
      if (editing.ScheduleDay == null) {
        toast({
          title: "Thiếu ngày",
          description: "Chọn ngày lịch trình hợp lệ.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const key = (editing.ServiceKey ?? "").trim();
      if (!key) {
        toast({
          title: "Thiếu dịch vụ",
          description: "Chọn dịch vụ đi kèm hợp lệ.",
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      const formData = new FormData();
      if (editing.Caption != null) {
        formData.append("Caption", editing.Caption);
      }
      if (editing.Content != null) {
        formData.append("Content", editing.Content);
      }
      formData.append("Category", editing.Category);
      if (editing.Category === "Schedule") {
        formData.append("ScheduleDay", String(editing.ScheduleDay));
      } else {
        formData.append("ServiceKey", (editing.ServiceKey ?? "").trim());
      }
      if (previewFile) {
        formData.append("imageFile", previewFile);
      }

      const response = await fetch(
        `/api/admin/tours/details/${tourId}/images/${editing.ImageID}`,
        { method: "PATCH", body: formData }
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || "Update failed");

      setItems((prev) =>
        prev.map((item) =>
          item.ImageID === editing.ImageID
            ? {
                ...item,
                Caption: editing.Caption,
                Content: editing.Content,
                Category: editing.Category,
                ScheduleDay: editing.ScheduleDay,
                ServiceKey: editing.ServiceKey,
                ImageURL: previewURL || item.ImageURL,
              }
            : item
        )
      );
      toast({ title: "Đã lưu", description: "Ảnh đã được cập nhật." });
      closeEdit();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể cập nhật ảnh";
      toast({ title: "Lỗi", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(
        `/api/admin/tours/details/${tourId}/images/${deleteId}`,
        { method: "DELETE" }
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json?.message || "Delete failed");
      setItems((prev) => prev.filter((item) => item.ImageID !== deleteId));
      toast({ title: "Đã xoá", description: "Ảnh đã được xoá." });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xoá ảnh";
      toast({ title: "Lỗi", description: message, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };
  const renderCard = (item: GalleryStateItem) => (
    <div
      key={item.ImageID}
      className="flex flex-col rounded-lg shadow-md hover:shadow-lg overflow-hidden transition bg-white dark:bg-zinc-800 h-full"
    >
      <div className="relative w-full aspect-video">
        <Image
          src={item.ImageURL || "/placeholder.svg"}
          alt={item.Caption || `Ảnh ${item.ImageID}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between gap-3 flex-1">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{translateCategory(item.Category)}</Badge>
            {item.Category === "Schedule" && item.ScheduleDay != null && (
              <Badge variant="outline">Ngày {item.ScheduleDay}</Badge>
            )}
            {item.Category === "Included Services" && item.ServiceKey && (
              <Badge variant="outline" className="max-w-[180px] truncate">
                {item.ServiceKey}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-base">
            {item.Caption || "Không có caption"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.6em]">
            {item.Content || "(Chưa có nội dung chi tiết)"}
          </p>
        </div>

        <div className="flex gap-3 pt-1 flex-wrap">
          <Button
            size="sm"
            className="flex-1 shrink"
            variant="outline"
            onClick={() => openEdit(item)}
          >
            <Pencil className="h-4 w-4 mr-1" /> Sửa
          </Button>
          <Button
            size="sm"
            className="flex-1 shrink bg-destructive text-white hover:bg-destructive/90"
            onClick={() => setDeleteId(item.ImageID)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Xoá
          </Button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as GalleryCategory)}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="Schedule">Lịch trình</TabsTrigger>
          <TabsTrigger value="Included Services">Dịch vụ bao gồm</TabsTrigger>
        </TabsList>

        <TabsContent value="Schedule" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
            <div className="space-y-2">
              {scheduleOptions.length ? (
                scheduleOptions.map((option) => (
                  <Button
                    key={option.day}
                    variant={
                      option.day === selectedScheduleDay ? "default" : "outline"
                    }
                    className="w-full justify-between items-center px-4 py-3 text-left"
                    onClick={() => setSelectedScheduleDay(option.day)}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">{`Ngày ${option.day}`}</span>
                      {option.title && (
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {option.title}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {scheduleCounts.get(option.day) ?? 0}
                    </Badge>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có lịch trình để hiển thị.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {activeSchedule ? (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">{`Ngày ${activeSchedule.day}`}</h3>
                        {activeSchedule.title && (
                          <p className="text-sm text-muted-foreground">
                            {activeSchedule.title}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          openCreate("Schedule", { day: activeSchedule.day })
                        }
                        disabled={!scheduleOptions.length}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
                      </Button>
                    </div>
                    {activeSchedule.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {activeSchedule.description}
                      </p>
                    )}
                  </div>

                  {scheduleItemsForSelected.length ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {scheduleItemsForSelected.map(renderCard)}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground text-center">
                      Chưa có ảnh cho ngày này. Thêm ảnh để minh hoạ lịch trình.
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground text-center">
                  Chọn một ngày trong lịch trình để xem và quản lý ảnh đính kèm.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Included Services" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
            <div className="space-y-2">
              {serviceOptions.length ? (
                serviceOptions.map((option) => (
                  <Button
                    key={option.key}
                    variant={
                      option.value === selectedServiceKey ? "default" : "outline"
                    }
                    className="w-full justify-between items-center px-4 py-3 text-left"
                    onClick={() => setSelectedServiceKey(option.value)}
                  >
                    <span className="text-sm font-medium truncate max-w-[160px]">
                      {option.label}
                    </span>
                    <Badge variant="secondary">
                      {serviceCounts.get(option.value) ?? 0}
                    </Badge>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có dịch vụ nào trong danh sách.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {activeService ? (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-semibold max-w-[320px] truncate">
                      {activeService.label}
                    </h3>
                    <Button
                      size="sm"
                      onClick={() =>
                        openCreate("Included Services", {
                          serviceKey: activeService.value,
                        })
                      }
                      disabled={!serviceOptions.length}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Thêm ảnh
                    </Button>
                  </div>

                  {serviceItemsForSelected.length ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {serviceItemsForSelected.map(renderCard)}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground text-center">
                      Chưa có ảnh cho dịch vụ này. Thêm ảnh để minh hoạ tiện ích đi kèm.
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground text-center">
                  Chọn một dịch vụ để xem và quản lý ảnh đính kèm.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={createOpen} onOpenChange={(open) => !open && closeCreate()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm ảnh chi tiết</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
              <Image
                src={createPreviewURL || "/placeholder.svg"}
                alt={createCaption || "preview"}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <Label>Chọn ảnh</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  if (createPreviewURL) {
                    URL.revokeObjectURL(createPreviewURL);
                  }
                  setCreateFile(file);
                  setCreatePreviewURL(file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>

            <div>
              <Label>Caption</Label>
              <Input
                value={createCaption}
                onChange={(event) => setCreateCaption(event.target.value)}
                placeholder="VD: Hoàng hôn trên vịnh"
              />
            </div>

            <div>
              <Label>Danh mục</Label>
              <select
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                value={createCategory}
                onChange={(event) => {
                  const nextCategory = event.target.value as GalleryCategory;
                  setCreateCategory(nextCategory);
                  if (nextCategory === "Schedule") {
                    setCreateScheduleDay(scheduleOptions[0]?.day ?? null);
                    setCreateServiceKey(null);
                  } else {
                    setCreateServiceKey(serviceOptions[0]?.value ?? null);
                    setCreateScheduleDay(null);
                  }
                }}
              >
                {GALLERY_CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {translateCategory(option)}
                  </option>
                ))}
              </select>
            </div>

            {createCategory === "Schedule" ? (
              <div>
                <Label>Áp dụng cho ngày</Label>
                {scheduleOptions.length ? (
                  <select
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                    value={createScheduleDay != null ? String(createScheduleDay) : ""}
                    onChange={(event) => {
                      const raw = event.target.value;
                      const parsed = raw ? Number(raw) : Number.NaN;
                      setCreateScheduleDay(
                        Number.isFinite(parsed) ? Math.floor(parsed) : null
                      );
                    }}
                  >
                    {scheduleOptions.map((option) => (
                      <option key={option.day} value={option.day}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Thêm lịch trình trước khi tải ảnh.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <Label>Áp dụng cho dịch vụ</Label>
                {serviceOptions.length ? (
                  <select
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                    value={createServiceKey ?? ""}
                    onChange={(event) => setCreateServiceKey(event.target.value)}
                  >
                    {serviceOptions.map((option) => (
                      <option key={option.key} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Thêm dịch vụ bao gồm trước khi tải ảnh.
                  </p>
                )}
              </div>
            )}

            <div>
              <Label>Nội dung chi tiết</Label>
              <Textarea
                rows={5}
                value={createContent}
                onChange={(event) => setCreateContent(event.target.value)}
                placeholder="Mô tả chi tiết cho ảnh này (dịch vụ/hoạt động)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={closeCreate} disabled={createSaving}>
              Huỷ
            </Button>
            <Button onClick={submitCreate} disabled={createSaving}>
              {createSaving ? "Đang lưu..." : "Thêm ảnh"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editing} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sửa ảnh chi tiết</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <Image
                  src={previewURL || editing.ImageURL || "/placeholder.svg"}
                  alt={editing.Caption || "preview"}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <Label>Đổi ảnh (tuỳ chọn)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    if (previewURL) {
                      URL.revokeObjectURL(previewURL);
                    }
                    setPreviewFile(file);
                    setPreviewURL(file ? URL.createObjectURL(file) : null);
                  }}
                />
              </div>

              <div>
                <Label>Caption</Label>
                <Input
                  value={editing.Caption ?? ""}
                  onChange={(event) =>
                    setEditing((prev) =>
                      prev ? { ...prev, Caption: event.target.value } : prev
                    )
                  }
                />
              </div>

              <div>
                <Label>Danh mục</Label>
                <select
                  className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                  value={editing.Category}
                  onChange={(event) => {
                    const nextCategory = event.target.value as GalleryCategory;
                    setEditing((prev) =>
                      prev
                        ? {
                            ...prev,
                            Category: nextCategory,
                            ScheduleDay:
                              nextCategory === "Schedule"
                                ? scheduleOptions[0]?.day ?? null
                                : null,
                            ServiceKey:
                              nextCategory === "Included Services"
                                ? serviceOptions[0]?.value ?? null
                                : null,
                          }
                        : prev
                    );
                  }}
                >
                  {GALLERY_CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {translateCategory(option)}
                    </option>
                  ))}
                </select>
              </div>

              {editing.Category === "Schedule" ? (
                <div>
                  <Label>Áp dụng cho ngày</Label>
                  {scheduleOptions.length ? (
                    <select
                      className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                      value={
                        editing.ScheduleDay != null
                          ? String(editing.ScheduleDay)
                          : ""
                      }
                      onChange={(event) => {
                        const raw = event.target.value;
                        const parsed = raw ? Number(raw) : Number.NaN;
                        setEditing((prev) =>
                          prev
                            ? {
                                ...prev,
                                ScheduleDay: Number.isFinite(parsed)
                                  ? Math.floor(parsed)
                                  : null,
                              }
                            : prev
                        );
                      }}
                    >
                      {scheduleOptions.map((option) => (
                        <option key={option.day} value={option.day}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Thêm lịch trình trước khi cập nhật ảnh.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <Label>Áp dụng cho dịch vụ</Label>
                  {serviceOptions.length ? (
                    <select
                      className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                      value={editing.ServiceKey ?? ""}
                      onChange={(event) =>
                        setEditing((prev) =>
                          prev
                            ? { ...prev, ServiceKey: event.target.value }
                            : prev
                        )
                      }
                    >
                      {serviceOptions.map((option) => (
                        <option key={option.key} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Thêm dịch vụ bao gồm trước khi cập nhật ảnh.
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label>Nội dung chi tiết</Label>
                <Textarea
                  rows={5}
                  value={editing.Content ?? ""}
                  onChange={(event) =>
                    setEditing((prev) =>
                      prev ? { ...prev, Content: event.target.value } : prev
                    )
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={closeEdit}>
              Huỷ
            </Button>
            <Button onClick={submitEdit} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá ảnh này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
