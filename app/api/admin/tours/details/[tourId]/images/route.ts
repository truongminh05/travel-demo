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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { tourId: tourIdParam } = await params;
  const tourId = Number.parseInt(tourIdParam, 10);
  if (!Number.isInteger(tourId) || tourId <= 0) {
    return NextResponse.json(
      { message: "tourId không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("imageFile");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { message: "Thiếu ảnh upload hợp lệ" },
        { status: 400 }
      );
    }
    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "File phải là ảnh hợp lệ" },
        { status: 415 }
      );
    }

    const captionEntry = form.get("Caption");
    const contentEntry = form.get("Content");
    const categoryEntry = form.get("Category");
    const scheduleEntry = form.get("ScheduleDay");
    const serviceEntry = form.get("ServiceKey");

    if (typeof categoryEntry !== "string" || !categoryEntry.trim()) {
      return NextResponse.json(
        { message: "Vui lòng chọn danh mục hợp lệ" },
        { status: 400 }
      );
    }

    const caption = typeof captionEntry === "string" ? captionEntry.trim() : "";
    const content = typeof contentEntry === "string" ? contentEntry.trim() : "";
    const category = ensureGalleryCategory(categoryEntry);

    let scheduleDay: number | null = null;
    let serviceKey: string | null = null;

    if (category === "Schedule") {
      const raw = typeof scheduleEntry === "string" ? scheduleEntry.trim() : "";
      const parsed = raw ? Number(raw) : Number.NaN;
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return NextResponse.json(
          { message: "Vui lòng chọn ngày hợp lệ cho ảnh lịch trình" },
          { status: 400 }
        );
      }
      scheduleDay = Math.floor(parsed);
    } else {
      const raw = typeof serviceEntry === "string" ? serviceEntry.trim() : "";
      if (!raw) {
        return NextResponse.json(
          { message: "Vui lòng chọn dịch vụ đi kèm cho ảnh" },
          { status: 400 }
        );
      }
      serviceKey = raw;
    }

    const uploadsDir = await ensureUploadsDir();
    const originalName = path.basename(file.name);
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    const { data, error } = await supabase
      .from("TourGallery")
      .insert({
        TourID: tourId,
        ImageURL: `/uploads/${filename}`,
        Caption: caption,
        Content: content,
        Category: category,
        ScheduleDay: scheduleDay,
        ServiceKey: serviceKey,
      })
      .select(
        "ImageID, ImageURL, Caption, Content, Category, ScheduleDay, ServiceKey"
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Đã thêm ảnh thành công", item: data },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /images] error:", err); // <-- in stack/chi tiết
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { tourId: tourIdStr } = await params;
  const imageIdStr = req.nextUrl.searchParams.get("imageId");
  if (!imageIdStr) {
    return NextResponse.json({ message: "Missing imageId" }, { status: 400 });
  }
  const tourId = Number.parseInt(tourIdStr, 10);
  const imageId = Number.parseInt(imageIdStr, 10);
  if (!Number.isInteger(tourId) || tourId <= 0 || !Number.isInteger(imageId)) {
    return NextResponse.json({ message: "Invalid params" }, { status: 400 });
  }

  const { error } = await supabase
    .from("TourGallery")
    .delete()
    .eq("TourID", tourId)
    .eq("ImageID", imageId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Đã xoá ảnh" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tourId: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { tourId: tourIdStr } = await params;
  const imageIdStr = req.nextUrl.searchParams.get("imageId");
  if (!imageIdStr) {
    return NextResponse.json({ message: "Missing imageId" }, { status: 400 });
  }
  const tourId = Number.parseInt(tourIdStr, 10);
  const imageId = Number.parseInt(imageIdStr, 10);
  if (!Number.isInteger(tourId) || tourId <= 0 || !Number.isInteger(imageId)) {
    return NextResponse.json({ message: "Invalid params" }, { status: 400 });
  }

  try {
    const existingRes = await supabase
      .from("TourGallery")
      .select("Category, ScheduleDay, ServiceKey")
      .eq("TourID", tourId)
      .eq("ImageID", imageId)
      .single();

    if (existingRes.error || !existingRes.data) {
      return NextResponse.json(
        { message: "Ảnh không tồn tại" },
        { status: 404 }
      );
    }

    const existing = existingRes.data as {
      Category: string | null;
      ScheduleDay: number | null;
      ServiceKey: string | null;
    };

    const form = await req.formData();
    const captionEntry = form.get("Caption");
    const contentEntry = form.get("Content");
    const categoryEntry = form.get("Category");
    const scheduleEntry = form.get("ScheduleDay");
    const serviceEntry = form.get("ServiceKey");
    const file = form.get("imageFile") as File | null;

    const updateData: {
      Caption?: string | null;
      Content?: string | null;
      Category?: GalleryCategory;
      ScheduleDay?: number | null;
      ServiceKey?: string | null;
      ImageURL?: string;
    } = {};

    if (typeof captionEntry === "string") {
      updateData.Caption = captionEntry;
    }
    if (typeof contentEntry === "string") {
      updateData.Content = contentEntry;
    }

    let targetCategory: GalleryCategory = ensureGalleryCategory(
      existing.Category
    );
    if (typeof categoryEntry === "string" && categoryEntry.trim()) {
      targetCategory = ensureGalleryCategory(categoryEntry);
      updateData.Category = targetCategory;
    }

    const scheduleRaw =
      typeof scheduleEntry === "string" ? scheduleEntry.trim() : "";
    const serviceRaw =
      typeof serviceEntry === "string" ? serviceEntry.trim() : "";

    if (targetCategory === "Schedule") {
      if (scheduleRaw) {
        const parsed = Number(scheduleRaw);
        if (!Number.isFinite(parsed) || parsed <= 0) {
          return NextResponse.json(
            { message: "Ngày lịch trình không hợp lệ" },
            { status: 400 }
          );
        }
        updateData.ScheduleDay = Math.floor(parsed);
      } else if (
        updateData.Category &&
        updateData.Category !== ensureGalleryCategory(existing.Category)
      ) {
        return NextResponse.json(
          { message: "Vui lòng chọn ngày cho ảnh lịch trình" },
          { status: 400 }
        );
      } else {
        updateData.ScheduleDay = existing.ScheduleDay;
      }
      updateData.ServiceKey = null;
    } else {
      if (serviceRaw) {
        updateData.ServiceKey = serviceRaw;
      } else if (
        updateData.Category &&
        updateData.Category !== ensureGalleryCategory(existing.Category)
      ) {
        return NextResponse.json(
          { message: "Vui lòng chọn dịch vụ đi kèm cho ảnh" },
          { status: 400 }
        );
      } else {
        updateData.ServiceKey = existing.ServiceKey;
      }
      updateData.ScheduleDay = null;
    }

    if (file && file.size > 0) {
      if (!file.type || !file.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "File phải là ảnh hợp lệ" },
          { status: 415 }
        );
      }
      const uploadsDir = await ensureUploadsDir();
      const safeName = path
        .basename(file.name)
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}-${safeName}`;
      const buffer = Buffer.from(await file.arrayBuffer());
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

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Đã cập nhật ảnh" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
