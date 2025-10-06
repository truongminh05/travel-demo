"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, CheckIcon, AlertTriangleIcon } from "lucide-react";

interface BookingPayment {
  id: number;
  amount: number;
  status: string;
  method: string | null;
  confirmationDate: string | null;
}

interface BookingItem {
  id: number;
  reference: string;
  bookingDate: string | null;
  departureDate: string | null;
  guests: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  bookingType: string;
  paymentMethodId: number | null;
  tour: {
    id: number;
    title: string;
    slug: string;
  } | null;
  customer: {
    id: number;
    name: string | null;
    email: string;
  } | null;
  payments: BookingPayment[];
}

const BOOKING_STATUS_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending_consultation: { label: "Chờ tư vấn", variant: "secondary" },
  pending_deposit: { label: "Chờ chuyển khoản", variant: "secondary" },
  confirmed: { label: "Đã xác nhận", variant: "default" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

const PAYMENT_STATUS_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Chờ thanh toán", variant: "outline" },
  paid: { label: "Đã thanh toán", variant: "default" },
  failed: { label: "Thanh toán thất bại", variant: "destructive" },
  refunded: { label: "Đã hoàn tiền", variant: "secondary" },
  cancelled: { label: "Đã hủy", variant: "secondary" },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const formatDate = (value: string | null) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/bookings", { cache: "no-store" });
      if (response.status === 403) {
        setError("Bạn không có quyền truy cập mục này.");
        setBookings([]);
        return;
      }
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || "Không thể tải danh sách đặt tour");
      }
      const data = (await response.json()) as { bookings: BookingItem[] };
      setBookings(data.bookings);
    } catch (err) {
      console.error("[admin bookings] fetch error", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  const handleUpdateStatus = async (
    bookingId: number,
    updates: { status?: string; paymentStatus?: string }
  ) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || "Không thể cập nhật trạng thái");
      }

      const payload = (await response.json()) as {
        booking: {
          BookingID: number;
          Status: string;
          PaymentStatus?: string | null;
        };
      };

      setBookings((prev) =>
        prev.map((item) =>
          item.id === bookingId
            ? {
                ...item,
                status: payload.booking.Status ?? item.status,
                paymentStatus:
                  payload.booking.PaymentStatus?.toLowerCase() ?? item.paymentStatus,
              }
            : item
        )
      );

      toast({ title: "Đã cập nhật trạng thái đặt tour" });
    } catch (err) {
      console.error("[admin bookings] update error", err);
      toast({
        title: "Không thể cập nhật",
        description: err instanceof Error ? err.message : "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const pendingConsultation = useMemo(
    () => bookings.filter((booking) => booking.status === "pending_consultation").length,
    [bookings]
  );

  const pendingDeposit = useMemo(
    () => bookings.filter((booking) => booking.status === "pending_deposit").length,
    [bookings]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý đặt tour</CardTitle>
          <CardDescription>
            Theo dõi yêu cầu đặt tour, xác nhận sau khi tư vấn và khi nhận chuyển khoản.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Chờ tư vấn</p>
              <p className="text-2xl font-semibold">{pendingConsultation}</p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Chờ chuyển khoản</p>
              <p className="text-2xl font-semibold">{pendingDeposit}</p>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Tổng đặt tour</p>
              <p className="text-2xl font-semibold">{bookings.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đặt tour</CardTitle>
              <CardDescription>
                Cập nhật trạng thái sau khi tư vấn khách hàng hoặc xác nhận đã nhận chuyển khoản.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => void loadBookings()} disabled={isLoading}>
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-destructive">
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đặt tour</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead className="hidden md:table-cell">Khởi hành</TableHead>
                  <TableHead className="hidden lg:table-cell">Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Chưa có đặt tour nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => {
                    const statusMeta =
                      BOOKING_STATUS_LABEL[booking.status] ?? BOOKING_STATUS_LABEL.pending_consultation;
                    const paymentMeta =
                      PAYMENT_STATUS_LABEL[booking.paymentStatus] ?? PAYMENT_STATUS_LABEL.pending;
                    const payment = booking.payments[0];

                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{booking.reference}</span>
                            <span className="text-xs text-muted-foreground">
                              Tạo ngày {formatDate(booking.bookingDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{booking.customer?.name || "Khách hàng"}</span>
                            <span className="text-xs text-muted-foreground">
                              {booking.customer?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.tour ? (
                            <Link
                              href={`/tours/${booking.tour.slug}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {booking.tour.title}
                            </Link>
                          ) : (
                            <span className="text-sm text-muted-foreground">Tour đã xoá</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            {formatDate(booking.departureDate)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-col text-sm">
                            <span>{formatCurrency(booking.totalAmount)}</span>
                            {payment ? (
                              <span className="text-xs text-muted-foreground">
                                Cọc: {formatCurrency(payment.amount)}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                            <Badge variant={paymentMeta.variant}>{paymentMeta.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {booking.status === "pending_consultation" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="gap-1"
                                  onClick={() =>
                                    handleUpdateStatus(booking.id, { status: "pending_deposit" })
                                  }
                                >
                                  <CheckIcon className="h-4 w-4" />
                                  Đã tư vấn - tiếp tục
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() =>
                                    handleUpdateStatus(booking.id, { status: "cancelled" })
                                  }
                                >
                                  <AlertTriangleIcon className="h-4 w-4" />
                                  Không đặt
                                </Button>
                              </>
                            ) : null}

                            {booking.status === "pending_deposit" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="gap-1"
                                  onClick={() =>
                                    handleUpdateStatus(booking.id, {
                                      paymentStatus: "paid",
                                    })
                                  }
                                >
                                  <CheckIcon className="h-4 w-4" />
                                  Xác nhận đã nhận chuyển khoản
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() =>
                                    handleUpdateStatus(booking.id, { status: "cancelled" })
                                  }
                                >
                                  <AlertTriangleIcon className="h-4 w-4" />
                                  Hủy đặt tour
                                </Button>
                              </>
                            ) : null}

                            {booking.status === "confirmed" ? (
                              <Badge variant="outline" className="justify-center">
                                Đã xác nhận
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
