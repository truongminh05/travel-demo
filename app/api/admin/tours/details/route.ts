import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Buffer } from "buffer";

type SchedulePayload = {
  dayNumber?: number | string | null;
  title?: string | null;
  description?: string | null;
};

type ScheduleParseResult = {
  provided: boolean;
  items: SchedulePayload[];
};

type IncludedParseResult = {
  provided: boolean;
  items: string[];
};

const GALLERY_CATEGORIES = ["Schedule", "Included Services"] as const;
type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
const DEFAULT_GALLERY_CATEGORY: GalleryCategory = GALLERY_CATEGORIES[0];
const GALLERY_CATEGORY_LOOKUP: Record<string, GalleryCategory> = {
  schedule: "Schedule",
  "included services": "Included Services",
  included: "Included Services",
  includedservices: "Included Services",
};

type GalleryInsertRow = {
  TourID: number;
  ImageURL: string;
  Caption: string;
  Content: string;
  Category: GalleryCategory;
  ScheduleDay: number | null;
  ServiceKey: string | null;
};

const ensureGalleryCategory = (
  value: string | null | undefined
): GalleryCategory => {
  const key = (value ?? "").trim().toLowerCase();
  return GALLERY_CATEGORY_LOOKUP[key] ?? DEFAULT_GALLERY_CATEGORY;
};

function parseSchedule(value: FormDataEntryValue | null): ScheduleParseResult {
  if (value === null) {
    return { provided: false, items: [] };
  }

  if (typeof value !== "string") {
    throw new Error("schedule payload must be a string");
  }

  if (!value.trim()) {
    return { provided: true, items: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("schedule payload is not valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("schedule payload must be an array");
  }

  const normalized = parsed.map((item) => {
    if (item && typeof item === "object") {
      const entry = item as Record<string, unknown>;
      const rawDay = entry.dayNumber ?? entry.day;
      const title =
        typeof entry.title === "string"
          ? entry.title
          : typeof entry.heading === "string"
          ? entry.heading
          : "";
      const description =
        typeof entry.description === "string"
          ? entry.description
          : typeof entry.content === "string"
          ? entry.content
          : "";

      return {
        dayNumber: rawDay as number | string | null | undefined,
        title,
        description,
      };
    }

    return { dayNumber: undefined, title: "", description: "" };
  });

  return { provided: true, items: normalized };
}

function parseIncluded(value: FormDataEntryValue | null): IncludedParseResult {
  if (value === null) {
    return { provided: false, items: [] };
  }

  if (typeof value !== "string") {
    throw new Error("included services payload must be a string");
  }

  if (!value.trim()) {
    return { provided: true, items: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("included services payload is not valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("included services payload must be an array");
  }

  const items = parsed
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry && typeof entry === "object") {
        const candidate = entry as { text?: unknown };
        if (typeof candidate.text === "string") {
          return candidate.text;
        }
      }
      return "";
    })
    .map((text) => text.trim())
    .filter((text) => text.length > 0);

  return { provided: true, items };
}

async function replaceSchedule(tourId: number, items: SchedulePayload[]) {
  const { error: deleteError } = await supabaseAdmin
    .from("TourItinerary")
    .delete()
    .eq("TourID", tourId);

  if (deleteError) {
    throw deleteError;
  }

  const rows = items.reduce<
    { TourID: number; DayNumber: number; Title: string; Description: string }[]
  >((acc, item, index) => {
    const title = (item.title ?? "").trim();
    const description = (item.description ?? "").trim();

    if (!title && !description) {
      return acc;
    }

    const numericDay = Number(
      item.dayNumber === undefined || item.dayNumber === null
        ? Number.NaN
        : item.dayNumber
    );
    const dayNumber =
      Number.isFinite(numericDay) && numericDay > 0
        ? Math.floor(numericDay)
        : index + 1;

    acc.push({
      TourID: tourId,
      DayNumber: dayNumber,
      Title: title || `Ngày ${dayNumber}`,
      Description: description,
    });

    return acc;
  }, []);

  if (!rows.length) {
    return;
  }

  const { error: insertError } = await supabaseAdmin
    .from("TourItinerary")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }
}

async function replaceIncluded(tourId: number, items: string[]) {
  const { error: deleteError } = await supabaseAdmin
    .from("TourHighlights")
    .delete()
    .eq("TourID", tourId);

  if (deleteError) {
    throw deleteError;
  }

  if (!items.length) {
    return;
  }

  const rows = items.map((text) => ({
    TourID: tourId,
    HighlightText: text,
  }));

  const { error: insertError } = await supabaseAdmin
    .from("TourHighlights")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }
}

async function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadsDir, { recursive: true });
  return uploadsDir;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  if (!session || userRole !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const tourId = Number(form.get("TourID"));
    const intro = (form.get("Intro") as string | null) ?? "";

    if (!tourId) {
      return NextResponse.json({ message: "Thiếu TourID" }, { status: 400 });
    }

    const { provided: scheduleProvided, items: scheduleItems } = parseSchedule(
      form.get("schedule")
    );
    const { provided: includedProvided, items: includedItems } = parseIncluded(
      form.get("includedServices")
    );

    const uploadsDir = await ensureUploadsDir();

    const tourUpdate: { Description?: string | null; Included?: string | null } = {};
    if (intro !== null) {
      tourUpdate.Description = intro.trim() ? intro : null;
    }
    if (includedProvided) {
      tourUpdate.Included = includedItems.length
        ? includedItems.join("\n")
        : null;
    }

    if (Object.keys(tourUpdate).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("Tours")
        .update(tourUpdate)
        .eq("TourID", tourId);

      if (updateError) {
        throw updateError;
      }
    }

    if (scheduleProvided) {
      await replaceSchedule(tourId, scheduleItems);
    }

    if (includedProvided) {
      await replaceIncluded(tourId, includedItems);
    }

    const files = form.getAll("imageFiles") as File[];
    const captions = form.getAll("captions[]").map((entry) => String(entry ?? ""));
    const contents = form.getAll("contents[]").map((entry) => String(entry ?? ""));
    const categories = form
      .getAll("categories[]")
      .map((entry) => String(entry ?? ""));
    const scheduleRefs = form
      .getAll("scheduleDays[]")
      .map((entry) => String(entry ?? ""));
    const serviceRefs = form
      .getAll("serviceKeys[]")
      .map((entry) => String(entry ?? ""));

    const rows: GalleryInsertRow[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (!file || file.size === 0) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      await writeFile(path.join(uploadsDir, filename), buffer);

      const category = ensureGalleryCategory(categories[index]);
      let scheduleDay: number | null = null;
      let serviceKey: string | null = null;

      if (category === "Schedule") {
        const raw = (scheduleRefs[index] ?? "").trim();
        const parsed = raw ? Number(raw) : Number.NaN;
        if (!Number.isFinite(parsed) || parsed <= 0) {
          throw new Error("Ảnh lịch trình cần chọn ngày hợp lệ");
        }
        scheduleDay = Math.floor(parsed);
      } else {
        const key = (serviceRefs[index] ?? "").trim();
        if (!key) {
          throw new Error("Ảnh dịch vụ cần chọn dịch vụ đi kèm");
        }
        serviceKey = key;
      }

      rows.push({
        TourID: tourId,
        ImageURL: `/uploads/${filename}`,
        Caption: captions[index] || "",
        Content: contents[index] || "",
        Category: category,
        ScheduleDay: scheduleDay,
        ServiceKey: serviceKey,
      });
    }

    if (rows.length) {
      const { error: insertError } = await supabaseAdmin
        .from("TourGallery")
        .insert(rows);
      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json(
      { message: "Tạo chi tiết tour thành công" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}