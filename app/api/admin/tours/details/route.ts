// app/api/admin/tours/details/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const tourId = Number(form.get("TourID"));
    const intro = (form.get("Intro") as string) || "";
    if (!tourId)
      return NextResponse.json({ message: "Thiếu TourID" }, { status: 400 });

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });

    // mô tả ngắn: lưu vào Tours.Description
    if (intro.trim()) {
      const { error: upErr } = await supabase
        .from("Tours")
        .update({ Description: intro }) // không đụng UpdatedAt
        .eq("TourID", tourId);
      if (upErr) throw upErr;
    }

    // ảnh + caption + content
    const files = form.getAll("imageFiles") as File[];
    const captions = form.getAll("captions[]").map((x) => String(x || ""));
    const contents = form.getAll("contents[]").map((x) => String(x || ""));

    const rows: {
      TourID: number;
      ImageURL: string;
      Caption: string;
      Content: string;
    }[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f || f.size === 0) continue;

      const bytes = await f.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${f.name.replace(/\s/g, "_")}`;
      await writeFile(path.join(uploadsDir, filename), buffer);

      rows.push({
        TourID: tourId,
        ImageURL: `/uploads/${filename}`,
        Caption: captions[i] || "",
        Content: contents[i] || "", // ⬅️ lưu content riêng
      });
    }

    if (rows.length) {
      const { error: insErr } = await supabase.from("TourGallery").insert(rows);
      if (insErr) throw insErr;
    }

    return NextResponse.json(
      { message: "Tạo chi tiết tour thành công" },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
