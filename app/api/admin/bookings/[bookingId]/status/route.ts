import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const parseId = (value: string) => {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

type StatusPayload = {
  status?: string;
  paymentStatus?: string;
  note?: string;
};

const ALLOWED_BOOKING_STATUSES = new Set([
  "pending_consultation",
  "pending_deposit",
  "confirmed",
  "cancelled",
]);

const ALLOWED_PAYMENT_STATUSES = new Set([
  "pending",
  "paid",
  "failed",
  "refunded",
  "cancelled",
]);

export async function PATCH(
  req: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { bookingId } = await context.params;
  const bookingIdNum = parseId(bookingId);
  if (!bookingIdNum) {
    return NextResponse.json({ message: "Invalid booking id" }, { status: 400 });
  }

  const payload = (await req.json().catch(() => null)) as StatusPayload | null;
  if (!payload) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (payload.status) {
    if (!ALLOWED_BOOKING_STATUSES.has(payload.status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }
    updates.Status = payload.status;
  }

  if (payload.paymentStatus) {
    if (!ALLOWED_PAYMENT_STATUSES.has(payload.paymentStatus)) {
      return NextResponse.json({ message: "Invalid payment status" }, { status: 400 });
    }
    updates.PaymentStatus = payload.paymentStatus;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ message: "No updates provided" }, { status: 400 });
  }

  if (payload.paymentStatus === "paid") {
    updates.Status = "confirmed";
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("Bookings")
      .update({
        ...updates,
        UpdatedAt: new Date().toISOString(),
      })
      .eq("BookingID", bookingIdNum)
      .select(
        "BookingID, Status, PaymentStatus, BookingReference, PaymentMethodID"
      )
      .single();

    if (error || !data) {
      throw error ?? new Error("Booking not found");
    }

    if (updates.PaymentStatus === "paid" || updates.Status === "confirmed") {
      await supabaseAdmin
        .from("Payments")
        .update({
          Status: "Paid",
          ConfirmationDate: new Date().toISOString(),
        })
        .eq("BookingID", bookingIdNum)
        .not("Status", "eq", "Paid");
    }

    if (updates.PaymentStatus && updates.PaymentStatus !== "paid") {
      await supabaseAdmin
        .from("Payments")
        .update({ Status: updates.PaymentStatus })
        .eq("BookingID", bookingIdNum);
    }

    return NextResponse.json({ booking: data });
  } catch (error) {
    console.error("[admin bookings status] error", error);
    return NextResponse.json(
      { message: "Không thể cập nhật trạng thái" },
      { status: 500 }
    );
  }
}
