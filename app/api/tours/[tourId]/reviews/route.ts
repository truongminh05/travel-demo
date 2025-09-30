import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

const clampRating = (value: number) => Math.min(5, Math.max(1, value));

const computeAverage = (
  ratings: Array<{ Rating: number | null }>,
  count?: number | null
) => {
  if (!ratings.length) return 0;
  const total = ratings.reduce((acc, item) => acc + (item.Rating ?? 0), 0);
  const divisor = count != null ? count : ratings.length;
  return divisor ? Number((total / divisor).toFixed(2)) : 0;
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ tourId: string }> }
) {
  const { tourId } = await context.params;
  const tourIdNum = Number(tourId);
  if (!Number.isFinite(tourIdNum)) {
    return NextResponse.json({ message: "Invalid tour id" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userIdRaw = (session?.user as { id?: string | number | null } | undefined)?.id ?? null;
  const userId =
    userIdRaw && Number.isFinite(Number(userIdRaw)) ? Number(userIdRaw) : null;

  const { data, error, count } = await supabaseAdmin
    .from("Reviews")
    .select("Rating", { count: "exact" })
    .eq("TourID", tourIdNum);

  if (error) {
    console.error("[tour reviews] get error", error);
    return NextResponse.json(
      { message: "Failed to load ratings" },
      { status: 500 }
    );
  }

  let userRating: number | null = null;
  if (userId) {
    const { data: userReview, error: userError } = await supabaseAdmin
      .from("Reviews")
      .select("Rating")
      .eq("TourID", tourIdNum)
      .eq("UserID", userId)
      .maybeSingle();

    if (!userError && userReview) {
      userRating = userReview.Rating ?? null;
    }
  }

  const averageRating = computeAverage(data ?? [], count);

  return NextResponse.json({
    averageRating,
    reviewCount: count ?? 0,
    userRating,
  });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ tourId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userIdRaw = (session?.user as { id?: string | number | null } | undefined)?.id ?? null;

  if (!userIdRaw) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { tourId } = await context.params;
  const tourIdNum = Number(tourId);
  if (!Number.isFinite(tourIdNum)) {
    return NextResponse.json({ message: "Invalid tour id" }, { status: 400 });
  }

  const userId = Number(userIdRaw);
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  const payload = await req.json().catch(() => null);
  const ratingValue = clampRating(Number(payload?.rating ?? 0));
  const comment =
    typeof payload?.comment === "string" ? payload.comment.trim() : null;

  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    return NextResponse.json(
      { message: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const reviewDate = new Date().toISOString();

  const { data: existingReview } = await supabaseAdmin
    .from("Reviews")
    .select("ReviewID")
    .eq("TourID", tourIdNum)
    .eq("UserID", userId)
    .maybeSingle();

  let upsertError: Error | null = null;

  if (existingReview?.ReviewID) {
    const { error } = await supabaseAdmin
      .from("Reviews")
      .update({
        Rating: ratingValue,
        Comment: comment,
        ReviewDate: reviewDate,
      })
      .eq("ReviewID", existingReview.ReviewID);

    if (error) {
      upsertError = error;
    }
  } else {
    const { error } = await supabaseAdmin.from("Reviews").insert({
      TourID: tourIdNum,
      UserID: userId,
      Rating: ratingValue,
      Comment: comment,
      ReviewDate: reviewDate,
    });

    if (error) {
      upsertError = error;
    }
  }

  if (upsertError) {
    console.error("[tour reviews] upsert error", upsertError);
    return NextResponse.json(
      { message: "Không thể lưu đánh giá" },
      { status: 500 }
    );
  }

  const {
    data: ratings,
    error: aggregateError,
    count,
  } = await supabaseAdmin
    .from("Reviews")
    .select("Rating", { count: "exact" })
    .eq("TourID", tourIdNum);

  if (aggregateError) {
    console.error("[tour reviews] aggregate error", aggregateError);
    return NextResponse.json(
      { message: "Không thể cập nhật xếp hạng" },
      { status: 500 }
    );
  }

  const averageRating = computeAverage(ratings ?? [], count);

  const { error: updateTourError } = await supabaseAdmin
    .from("Tours")
    .update({
      AverageRating: averageRating,
      ReviewCount: count != null ? String(count) : null,
      UpdatedAt: reviewDate,
    })
    .eq("TourID", tourIdNum);

  if (updateTourError) {
    console.error("[tour reviews] update tour error", updateTourError);
  }

  return NextResponse.json({
    averageRating,
    reviewCount: count ?? 0,
    userRating: ratingValue,
  });
}

