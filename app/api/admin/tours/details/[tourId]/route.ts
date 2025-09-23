// app/api/admin/tours/details/[tourId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { tourId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const tourId = Number(params.tourId);
    if (!tourId)
      return NextResponse.json(
        { message: "tourId không hợp lệ" },
        { status: 400 }
      );

    const intro = form.get("Intro") as string | null;
    const replaceAll = (form.get("replaceAll") as string) === "true";

    if (typeof intro === "string") {
      const { error: upErr } = await supabase
        .from("Tours")
        .update({ Description: intro })
        .eq("TourID", tourId);
      if (upErr) throw upErr;
    }

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });

    const files = form.getAll("imageFiles") as File[];
    const captions = form.getAll("captions[]").map((x) => String(x || ""));
    const contents = form.getAll("contents[]").map((x) => String(x || ""));

    if (replaceAll) {
      const { error: delErr } = await supabase
        .from("TourGallery")
        .delete()
        .eq("TourID", tourId);
      if (delErr) throw delErr;
    }

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
        Content: contents[i] || "", // ⬅️
      });
    }

    if (rows.length) {
      const { error: insErr } = await supabase.from("TourGallery").insert(rows);
      if (insErr) throw insErr;
    }

    return NextResponse.json({ message: "Cập nhật chi tiết tour thành công" });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
