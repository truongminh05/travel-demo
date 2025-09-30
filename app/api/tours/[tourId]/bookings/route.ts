import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

const TAX_RATE = 0.08;
const DEPOSIT_RATE = 0.05;

const parseId = (value: string) => {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

const toDecimal = (value: number) => value.toFixed(2);

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

const normalizePaymentMethod = (value: unknown) => {
  if (typeof value !== "string") return "bank" as const;
  if (value === "bank" || value === "momo" || value === "consultation") {
    return value as "bank" | "momo" | "consultation";
  }
  return "bank" as const;
};

export async function POST(
  req: Request,
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

  const payload = await req.json().catch(() => ({}));
  const guestsRaw = payload?.guests;
  const paymentMethod = normalizePaymentMethod(payload?.paymentMethod);
  const requestedGuests = Number.isFinite(Number(guestsRaw))
    ? Math.max(1, Number(guestsRaw))
    : 1;

  const departureDateIso = (() => {
    const value = typeof payload?.departureDate === "string" ? payload.departureDate : null;
    if (!value) return new Date().toISOString();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  })();

  try {
    const { data: tour, error: tourError } = await supabaseAdmin
      .from("Tours")
      .select(
        "TourID, Title, TourSlug, Price, Location, Duration"
      )
      .eq("TourID", tourIdNum)
      .single();

    if (tourError || !tour) {
      throw tourError ?? new Error("Tour not found");
    }

    const unitPrice = toNumber(tour.Price);
    const subtotal = unitPrice * requestedGuests;
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;
    const depositAmount =
      paymentMethod === "consultation" ? 0 : total * DEPOSIT_RATE;

    const bookingStatus =
      paymentMethod === "consultation" ? "pending_consultation" : "confirmed";

    const { data: booking, error } = await supabaseAdmin
      .from("Bookings")
      .insert({
        BookingReference: `TRV-${Date.now()}`,
        UserID: userId,
        TourID: tourIdNum,
        NumberOfGuests: requestedGuests,
        Subtotal: toDecimal(subtotal),
        Taxes: toDecimal(taxes),
        TotalAmount: toDecimal(total),
        DepartureDate: departureDateIso,
        Status: bookingStatus,
      })
      .select(
        "BookingID, BookingReference, DepartureDate, Subtotal, Taxes, TotalAmount, Status"
      )
      .single();

    if (error || !booking) {
      throw error ?? new Error("Booking failed");
    }

    if (paymentMethod !== "consultation") {
      const { error: paymentError } = await supabaseAdmin
        .from("Payments")
        .insert({
          BookingID: booking.BookingID,
          PaymentDate: new Date().toISOString(),
          Amount: toDecimal(depositAmount),
          PaymentMethod: paymentMethod === "bank" ? "Bank Transfer" : "MoMo",
          Status: "Paid",
        });

      if (paymentError) {
        throw paymentError;
      }
    }

    return NextResponse.json({
      message:
        paymentMethod === "consultation"
          ? "Yêu cầu tư vấn đã được ghi nhận"
          : "Đặt tour thành công",
      booking,
      deposit:
        paymentMethod === "consultation"
          ? null
          : {
              amount: depositAmount,
              method: paymentMethod,
            },
      consultation: paymentMethod === "consultation",
      tour: {
        id: tour.TourID,
        title: tour.Title,
        slug: tour.TourSlug,
        location: tour.Location,
        duration: tour.Duration,
        price: unitPrice,
        guests: requestedGuests,
      },
    });
  } catch (error) {
    console.error("[bookings] create error", error);
    return NextResponse.json(
      { message: "Không thể đặt tour. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
