import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "toString" in value) {
    const parsed = Number((value as { toString(): string }).toString());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const normaliseStatus = (status: unknown) => {
  if (typeof status !== "string") return "pending";
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) return "cancelled";
  if (normalized.includes("complete")) return "completed";
  if (normalized.includes("upcoming") || normalized.includes("confirmed")) {
    return "upcoming";
  }
  return normalized || "pending";
};

export async function GET() {

  const session = await getServerSession(authOptions);

  const userIdRaw = (session?.user as { id?: string | number | null } | undefined)?.id ?? null;

  if (!userIdRaw) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(userIdRaw);
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ message: "Invalid user identifier" }, { status: 400 });
  }

  try {
    const nowIso = new Date().toISOString();

    const {
      data: bookingsData,
      error: bookingsError,
      count: bookingsCount,
    } = await supabaseAdmin
      .from("Bookings")
      .select(
        `BookingID,
         BookingReference,
         BookingDate,
         DepartureDate,
         NumberOfGuests,
         TotalAmount,
         Status,
         Tours:TourID (
           TourID,
           TourSlug,
           Title,
           Location,
           Image,
           Duration,
           AverageRating,
           Price,
           OriginalPrice
         ),
         Reviews(Rating)
        `,
        { count: "exact" }
      )
      .eq("UserID", userId)
      .order("DepartureDate", { ascending: true });

    if (bookingsError) {
      throw bookingsError;
    }

    const bookings = (bookingsData ?? []).map((booking) => {
      const tour = (booking as any).Tours ?? null;
      const userReview = Array.isArray((booking as any).Reviews)
        ? (booking as any).Reviews[0]
        : null;

      return {
        id: booking.BookingID,
        reference: booking.BookingReference,
        bookingDate: booking.BookingDate,
        departureDate: booking.DepartureDate,
        guests: booking.NumberOfGuests,
        totalAmount: toNumber(booking.TotalAmount),
        status: normaliseStatus(booking.Status),
        tour: tour
          ? {
              id: tour.TourID,
              slug: tour.TourSlug,
              title: tour.Title,
              location: tour.Location,
              image: tour.Image,
              duration: tour.Duration,
              averageRating: toNumber(tour.AverageRating),
              price: toNumber(tour.Price),
              originalPrice: toNumber(tour.OriginalPrice),
            }
          : null,
        rating: userReview?.Rating != null ? toNumber(userReview.Rating) : null,
      };
    });

    const upcomingTrips = bookings
      .filter((booking) =>
        booking.departureDate
          ? new Date(booking.departureDate).toISOString() >= nowIso
          : false
      )
      .slice(0, 3);

    const {
      data: wishlistData,
      error: wishlistError,
    } = await supabaseAdmin
      .from("Wishlists")
      .select(
        `WishlistID,
         AddedDate,
         Tours:TourID (
           TourID,
           TourSlug,
           Title,
           Location,
           Image,
           AverageRating,
           Price,
           OriginalPrice,
           Duration,
           ReviewCount
         )
        `
      )
      .eq("UserID", userId)
      .order("AddedDate", { ascending: false });

    if (wishlistError) {
      throw wishlistError;
    }

    const savedTours = (wishlistData ?? [])
      .map((wishlist) => {
        const tour = (wishlist as any).Tours ?? null;
        if (!tour) return null;
        return {
          id: tour.TourID,
          slug: tour.TourSlug,
          title: tour.Title,
          location: tour.Location,
          image: tour.Image,
          duration: tour.Duration,
          averageRating: toNumber(tour.AverageRating),
          reviewCount: toNumber(tour.ReviewCount),
          price: toNumber(tour.Price),
          originalPrice: toNumber(tour.OriginalPrice),
          addedDate: wishlist.AddedDate,
        };
      })
      .filter(Boolean) as Array<{
      id: number;
      slug: string;
      title: string;
      location: string | null;
      image: string | null;
      duration: string | null;
      averageRating: number;
      reviewCount: number;
      price: number;
      originalPrice: number;
      addedDate: string | null;
    }>;

    const savedToursCount = savedTours.length;
    const averageSavedRating = savedToursCount
      ? Number(
          (
            savedTours.reduce(
              (acc, tour) => acc + (tour.averageRating || 0),
              0
            ) / savedToursCount
          ).toFixed(2)
        )
      : 0;

    const recentSaved = savedTours.slice(0, 4);
    const favoriteTours = [...savedTours]
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 4);

    return NextResponse.json({
      stats: {
        totalBookings: bookingsCount ?? bookings.length,
        savedTours: savedToursCount,
        averageSavedRating,
      },
      bookings,
      upcomingTrips,
      recentSaved,
      favoriteTours,
      savedTours,
    });
  } catch (error) {
    console.error("[account/overview] error", error);
    return NextResponse.json(
      { message: "Failed to load account data" },
      { status: 500 }
    );
  }
}




