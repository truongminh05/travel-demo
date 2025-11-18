import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const parseId = (value: string) => {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

export async function POST(
  _req: Request,
  context: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await context.params;
  const tourIdNum = parseId(tourId);
  if (!tourIdNum) {
    return NextResponse.json({ message: "Invalid tour id" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userIdRaw =
    (session?.user as { id?: string | number | null } | undefined)?.id ?? null;
  if (!userIdRaw) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(userIdRaw);
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  try {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("Wishlists")
      .select("WishlistID")
      .eq("UserID", userId)
      .eq("TourID", tourIdNum)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      return NextResponse.json({ message: "Tour already saved" });
    }

    const insertedAt = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("Wishlists")
      .insert({
        UserID: userId,
        TourID: tourIdNum,
        AddedDate: insertedAt,
      })
      .select("WishlistID, AddedDate")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Tour saved to favorites",
      wishlistId: data.WishlistID,
      addedDate: data.AddedDate ?? insertedAt,
    });
  } catch (error) {
    console.error("[wishlist] add error", error);
    return NextResponse.json(
      { message: "Không thể lưu tour vào yêu thích" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await context.params;
  const tourIdNum = parseId(tourId);
  if (!tourIdNum) {
    return NextResponse.json({ message: "Invalid tour id" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userIdRaw =
    (session?.user as { id?: string | number | null } | undefined)?.id ?? null;
  if (!userIdRaw) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(userIdRaw);
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from("Wishlists")
      .delete()
      .eq("UserID", userId)
      .eq("TourID", tourIdNum);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Tour removed from favorites" });
  } catch (error) {
    console.error("[wishlist] delete error", error);
    return NextResponse.json(
      { message: "Không thể xóa tour khỏi yêu thích" },
      { status: 500 }
    );
  }
}
