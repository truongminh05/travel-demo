import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Buffer } from "buffer";

const GALLERY_CATEGORY_OPTIONS = ["Schedule", "Included Services"] as const;
type GalleryCategory = (typeof GALLERY_CATEGORY_OPTIONS)[number];
const DEFAULT_GALLERY_CATEGORY: GalleryCategory = GALLERY_CATEGORY_OPTIONS[0];
const GALLERY_CATEGORY_LOOKUP: Record<string, GalleryCategory> = {
  schedule: "Schedule",
  "included services": "Included Services",
  included: "Included Services",
  includedservices: "Included Services",
};

const ensureGalleryCategory = (
  value: string | null | undefined
): GalleryCategory => {
  const key = (value ?? "").trim().toLowerCase();
  return GALLERY_CATEGORY_LOOKUP[key] ?? DEFAULT_GALLERY_CATEGORY;
};

async function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadsDir, { recursive: true });
  return uploadsDir;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ tourId: string; imageId: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { tourId: t, imageId: i } = await params;
  const tourId = Number.parseInt(t, 10);
  const imageId = Number.parseInt(i, 10);
  if (
    !Number.isInteger(tourId) ||
    tourId <= 0 ||
    !Number.isInteger(imageId) ||
    imageId <= 0
  ) {
    return NextResponse.json({ message: "Invalid params" }, { status: 400 });
  }

  const { error } = await supabase
    .from("TourGallery")
    .delete()
    .eq("TourID", tourId)
    .eq("ImageID", imageId);

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: "Đã xoá ảnh" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tourId: string; imageId: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { tourId: t, imageId: i } = await params;
  const tourId = Number.parseInt(t, 10);
  const imageId = Number.parseInt(i, 10);
  if (
    !Number.isInteger(tourId) ||
    tourId <= 0 ||
    !Number.isInteger(imageId) ||
    imageId <= 0
  ) {
    return NextResponse.json({ message: "Invalid params" }, { status: 400 });
  }

  try {
    const form = await req.formData();
    const captionEntry = form.get("Caption");
    const contentEntry = form.get("Content");
    const categoryEntry = form.get("Category");
    const scheduleEntry = form.get("ScheduleDay");
    const serviceEntry = form.get("ServiceKey");
    const file = form.get("imageFile");

    const updateData: {
      Caption?: string | null;
      Content?: string | null;
      Category?: GalleryCategory;
      ScheduleDay?: number | null;
      ServiceKey?: string | null;
      ImageURL?: string;
    } = {};

    if (typeof captionEntry === "string") updateData.Caption = captionEntry;
    if (typeof contentEntry === "string") updateData.Content = contentEntry;

    let resolvedCategory: GalleryCategory | null = null;
    if (typeof categoryEntry === "string") {
      resolvedCategory = ensureGalleryCategory(categoryEntry);
      updateData.Category = resolvedCategory;
    }

    const scheduleRaw =
      typeof scheduleEntry === "string" ? scheduleEntry.trim() : "";
    const serviceRaw =
      typeof serviceEntry === "string" ? serviceEntry.trim() : "";

    if (resolvedCategory === "Schedule") {
      if (!scheduleRaw) {
        return NextResponse.json(
          { message: "Vui lòng chọn ngày cho ảnh lịch trình" },
          { status: 400 }
        );
      }
      const n = Number(scheduleRaw);
      if (!Number.isFinite(n) || n <= 0) {
        return NextResponse.json(
          { message: "Ngày lịch trình không hợp lệ" },
          { status: 400 }
        );
      }
      updateData.ScheduleDay = Math.floor(n);
      updateData.ServiceKey = null;
    } else if (resolvedCategory === "Included Services") {
      if (!serviceRaw) {
        return NextResponse.json(
          { message: "Vui lòng chọn dịch vụ đi kèm cho ảnh" },
          { status: 400 }
        );
      }
      updateData.ServiceKey = serviceRaw;
      updateData.ScheduleDay = null;
    }

    if (file instanceof File && file.size > 0) {
      if (!file.type || !file.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "File phải là ảnh hợp lệ" },
          { status: 415 }
        );
      }
      const uploadsDir = await ensureUploadsDir();
      const originalName = typeof file.name === "string" ? file.name : "image";
      const safeBase = path
        .basename(originalName)
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}-${safeBase}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(path.join(uploadsDir, filename), buffer);
      updateData.ImageURL = `/uploads/${filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "Không có gì để cập nhật" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("TourGallery")
      .update(updateData)
      .eq("TourID", tourId)
      .eq("ImageID", imageId);

    if (error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ message: "Đã cập nhật ảnh" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
