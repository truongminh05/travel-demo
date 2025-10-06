import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

type BookingRow = {
  BookingID: number;
  BookingReference: string;
  DepartureDate: string | null;
  BookingDate: string | null;
  NumberOfGuests: number;
  TotalAmount: number | string | null;
  Status: string | null;
  PaymentStatus: string | null;
  BookingType: string | null;
  PaymentMethodID: number | null;
  Tours: {
    TourID: number;
    Title: string;
    TourSlug: string;
  } | null;
  Users: {
    UserID: number;
    FullName: string | null;
    Email: string;
  } | null;
  Payments: Array<{
    PaymentID: number;
    Amount: number | string | null;
    Status: string | null;
    PaymentMethod: string | null;
    ConfirmationDate: string | null;
  }>;
};

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

const normalizeStatus = (status: string | null | undefined) => {
  if (!status) return "pending";
  const normalized = status.toLowerCase();
  if (normalized.includes("consult")) return "pending_consultation";
  if (normalized.includes("confirm")) return "confirmed";
  if (normalized.includes("cancel")) return "cancelled";
  return normalized;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("Bookings")
      .select(
        `BookingID,
         BookingReference,
         DepartureDate,
         BookingDate,
         NumberOfGuests,
         TotalAmount,
         Status,
         PaymentStatus,
         BookingType,
         PaymentMethodID,
         Tours:TourID (TourID, Title, TourSlug),
         Users:UserID (UserID, FullName, Email),
         Payments(PaymentID, Amount, Status, PaymentMethod, ConfirmationDate)
        `
      )
      .order("BookingDate", { ascending: false });

    if (error) {
      throw error;
    }

    const bookings = (data ?? []).map((row) => {
      const booking = row as BookingRow;
      return {
        id: booking.BookingID,
        reference: booking.BookingReference,
        bookingDate: booking.BookingDate,
        departureDate: booking.DepartureDate,
        guests: booking.NumberOfGuests,
        totalAmount: toNumber(booking.TotalAmount),
        status: normalizeStatus(booking.Status),
        paymentStatus: (booking.PaymentStatus ?? "pending").toLowerCase(),
        bookingType: (booking.BookingType ?? "online").toLowerCase(),
        paymentMethodId: booking.PaymentMethodID,
        tour: booking.Tours
          ? {
              id: booking.Tours.TourID,
              title: booking.Tours.Title,
              slug: booking.Tours.TourSlug,
            }
          : null,
        customer: booking.Users
          ? {
              id: booking.Users.UserID,
              name: booking.Users.FullName,
              email: booking.Users.Email,
            }
          : null,
        payments: Array.isArray(booking.Payments)
          ? booking.Payments.map((payment) => ({
              id: payment.PaymentID,
              amount: toNumber(payment.Amount),
              status: (payment.Status ?? "pending").toLowerCase(),
              method: payment.PaymentMethod,
              confirmationDate: payment.ConfirmationDate,
            }))
          : [],
      };
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("[admin bookings] list error", error);
    return NextResponse.json(
      { message: "Không thể tải danh sách đặt tour" },
      { status: 500 }
    );
  }
}