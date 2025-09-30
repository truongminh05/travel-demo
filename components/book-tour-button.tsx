"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, TicketIcon } from "lucide-react";
import {
  loadPaymentMethods,
  savePaymentMethods,
  type PaymentAccounts,
} from "@/lib/payment-methods";
import { ManagePaymentMethodDialog } from "@/components/manage-payment-method-dialog";

const TAX_RATE = 0.08;
const DEPOSIT_RATE = 0.05;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Math.max(0, value)
  );

const computeTotals = (unitPrice: number, guests: number) => {
  if (!unitPrice || !Number.isFinite(unitPrice)) {
    return { subtotal: 0, taxes: 0, total: 0, deposit: 0 };
  }
  const subtotal = unitPrice * guests;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;
  const deposit = total * DEPOSIT_RATE;
  return { subtotal, taxes, total, deposit };
};

type ButtonVariant = ComponentProps<typeof Button>["variant"];
type ButtonSize = ComponentProps<typeof Button>["size"];
type PaymentMethod = "bank" | "momo" | "consultation";

interface BookTourButtonProps {
  tourId: number;
  tourSlug?: string;
  defaultGuests?: number;
  unitPrice?: number | null;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  buttonClassName?: string;
}

export function BookTourButton({
  tourId,
  tourSlug,
  defaultGuests = 1,
  unitPrice,
  buttonVariant = "default",
  buttonSize = "default",
  buttonClassName,
}: BookTourButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [guests, setGuests] = useState(defaultGuests);
  const [departureDate, setDepartureDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const [accounts, setAccounts] = useState<PaymentAccounts>({});
  const [manageOpen, setManageOpen] = useState(false);

  const normalizedPrice = typeof unitPrice === "number" ? unitPrice : 0;

  const totals = useMemo(
    () => computeTotals(normalizedPrice, guests),
    [normalizedPrice, guests]
  );

  const depositAmount =
    paymentMethod === "consultation" ? 0 : totals.deposit;

  const hasBankAccount = Boolean(
    accounts.bank?.bankName && accounts.bank?.accountNumber
  );
  const hasMomoAccount = Boolean(accounts.momo?.phoneNumber);

  const selectedPaymentMethodId =
    paymentMethod === "bank"
      ? accounts.bank?.id
      : paymentMethod === "momo"
      ? accounts.momo?.id
      : undefined;

  const getReturnUrl = () => {
    if (tourSlug) {
      return `/tours/${tourSlug}`;
    }
    if (typeof window !== "undefined") {
      return window.location.pathname || "/tours";
    }
    return "/tours";
  };

  const handleAuthRedirect = () => {
    const target = getReturnUrl();
    router.push(`/login?redirect=${encodeURIComponent(target)}`);
  };

  const redirectToAddPayment = (preferred?: PaymentMethod) => {
    const params = new URLSearchParams();
    params.set("tourId", String(tourId));
    const returnUrl = getReturnUrl();
    params.set("returnUrl", returnUrl);
    params.set("guests", String(guests));
    if (departureDate) {
      params.set("departureDate", departureDate);
    }
    if (tourSlug) {
      params.set("tourSlug", tourSlug);
    }
    if (preferred && preferred !== "consultation") {
      params.set("preferred", preferred);
    }

    router.push(`/account/payment-methods/add?${params.toString()}`);
  };

  useEffect(() => {
    if (!open) return;
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setOpen(false);
      handleAuthRedirect();
      return;
    }

    let cancelled = false;

    const loadMethods = async () => {
      setIsLoadingMethods(true);
      try {
        const storedPreference =
          typeof window !== "undefined"
            ? (localStorage.getItem("paymentPreference") as PaymentMethod | null)
            : null;

        const methods = await loadPaymentMethods();
        if (cancelled) return;

        if (!methods.bank && !methods.momo) {
          setOpen(false);
          redirectToAddPayment(storedPreference ?? undefined);
          return;
        }

        setAccounts(methods);

        let nextMethod: PaymentMethod = "consultation";
        if (storedPreference === "bank" && methods.bank) {
          nextMethod = "bank";
        } else if (storedPreference === "momo" && methods.momo) {
          nextMethod = "momo";
        } else if (methods.bank) {
          nextMethod = "bank";
        } else if (methods.momo) {
          nextMethod = "momo";
        }

        setPaymentMethod(nextMethod);
      } catch (error) {
        console.error("[BookTourButton] load methods error", error);
        toast({
          title: "Không thể tải phương thức thanh toán",
          description: "Vui lòng thử lại hoặc thêm phương thức mới.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) {
          setIsLoadingMethods(false);
        }
      }
    };

    loadMethods();

    return () => {
      cancelled = true;
    };
  }, [open, status, toast]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("paymentPreference", paymentMethod);
  }, [paymentMethod]);

  const ensurePaymentMethodAvailability = (method: PaymentMethod) => {
    if (method === "bank" && !accounts.bank) {
      redirectToAddPayment("bank");
      return false;
    }
    if (method === "momo" && !accounts.momo) {
      redirectToAddPayment("momo");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (status !== "authenticated") {
      handleAuthRedirect();
      return;
    }

    if (!ensurePaymentMethodAvailability(paymentMethod)) {
      return;
    }

    if (paymentMethod !== "consultation" && !selectedPaymentMethodId) {
      toast({
        title: "Thiếu phương thức thanh toán",
        description: "Vui lòng cập nhật thông tin trước khi tiếp tục.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/tours/${tourId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guests,
          departureDate: departureDate || undefined,
          paymentMethod,
          paymentMethodId: selectedPaymentMethodId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Không thể đặt tour");
      }

      setOpen(false);
      router.refresh();

      if (paymentMethod === "consultation") {
        toast({
          title: "Đã gửi yêu cầu tư vấn",
          description:
            "Quản trị viên sẽ liên hệ bạn để xác nhận và cập nhật trạng thái đặt tour.",
        });
        router.push("/account");
        return;
      }

      const depositValue = data?.deposit?.amount ?? depositAmount;
      toast({
        title: "Đã tạo yêu cầu đặt tour",
        description: `Hệ thống sẽ tự động xác nhận \"Đặt tour thành công\" khi khoản chuyển ${formatCurrency(
          depositValue
        )} được xác nhận.`,
      });
      router.push("/account");
    } catch (error) {
      console.error("[BookTourButton] submit error", error);
      toast({
        title: "Đặt tour thất bại",
        description:
          error instanceof Error ? error.message : "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerBooking = () => {
    if (status === "unauthenticated") {
      handleAuthRedirect();
      return;
    }
    setOpen(true);
  };

  const handleSaveAccounts = async (next: PaymentAccounts) => {
    try {
      const updated = await savePaymentMethods(next);
      setAccounts(updated);
      toast({
        title: "Đã cập nhật phương thức thanh toán",
        description: "Thông tin tài khoản đã được lưu thành công.",
      });
      return updated;
    } catch (error) {
      toast({
        title: "Lưu phương thức thanh toán thất bại",
        description:
          error instanceof Error ? error.message : "Vui lòng thử lại sau.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={buttonVariant}
            size={buttonSize}
            className={`flex items-center gap-2 ${buttonClassName ?? ""}`.trim()}
            onClick={triggerBooking}
          >
            <TicketIcon className="w-4 h-4" />
            Đặt tour ngay
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Đặt tour</DialogTitle>
              <DialogDescription>
                Hoàn tất các bước bên dưới để tạo đặt chỗ cho tour này.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Bước 1 · Thông tin chuyến đi
                </p>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="guests">Số lượng khách</Label>
                    <div className="relative">
                      <Input
                        id="guests"
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(event) =>
                          setGuests(Math.max(1, Number(event.target.value) || 1))
                        }
                        required
                      />
                      <TicketIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departure">Ngày khởi hành dự kiến</Label>
                    <div className="relative">
                      <Input
                        id="departure"
                        type="date"
                        value={departureDate}
                        onChange={(event) => setDepartureDate(event.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      (Không bắt buộc) Để trống nếu bạn chưa xác định.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Bước 2 · Chọn phương thức thanh toán
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Các phương thức được lấy từ mục Thanh toán trong hồ sơ của bạn.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setManageOpen(true)}
                  >
                    Quản lý tài khoản
                  </Button>
                </div>

                {isLoadingMethods ? (
                  <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Đang tải phương thức thanh toán đã lưu...
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(nextValue) => {
                        const nextMethod = nextValue as PaymentMethod;
                        if (!ensurePaymentMethodAvailability(nextMethod)) {
                          return;
                        }
                        setPaymentMethod(nextMethod);
                      }}
                      className="space-y-3"
                    >
                      <div className="flex items-start gap-3 rounded-md border p-3">
                        <RadioGroupItem value="bank" id="payment-bank" />
                        <Label htmlFor="payment-bank" className="flex-1 space-y-1">
                          <span className="block font-medium">Chuyển khoản ngân hàng</span>
                          <span className="block text-sm text-muted-foreground">
                            Đặt cọc 5% qua tài khoản ngân hàng. {hasBankAccount ? "" : "(Chưa có tài khoản)"}
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-start gap-3 rounded-md border p-3">
                        <RadioGroupItem value="momo" id="payment-momo" />
                        <Label htmlFor="payment-momo" className="flex-1 space-y-1">
                          <span className="block font-medium">Ví MoMo</span>
                          <span className="block text-sm text-muted-foreground">
                            Đặt cọc 5% qua ví điện tử. {hasMomoAccount ? "" : "(Chưa có tài khoản)"}
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-start gap-3 rounded-md border p-3">
                        <RadioGroupItem value="consultation" id="payment-consult" />
                        <Label htmlFor="payment-consult" className="flex-1 space-y-1">
                          <span className="block font-medium">Liên hệ tư vấn</span>
                          <span className="block text-sm text-muted-foreground">
                            Yêu cầu đội ngũ tư vấn liên hệ, chưa cần thanh toán online.
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "consultation" ? (
                      <p className="text-sm text-muted-foreground">
                        Yêu cầu của bạn sẽ được chuyển cho quản trị viên để xác nhận và thông báo kết quả đặt tour.
                      </p>
                    ) : (
                      <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tổng tạm tính</span>
                          <span>{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Thuế & phí (8%)</span>
                          <span>{formatCurrency(totals.taxes)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Tiền đặt cọc (5%)</span>
                          <span>{formatCurrency(depositAmount)}</span>
                        </div>
                        {paymentMethod === "bank" && accounts.bank && (
                          <div className="text-xs text-muted-foreground pt-2">
                            <p>
                              <strong>Ngân hàng:</strong> {accounts.bank.bankName}
                            </p>
                            <p>
                              <strong>Chủ tài khoản:</strong> {accounts.bank.accountName}
                            </p>
                            <p>
                              <strong>Số tài khoản:</strong> {accounts.bank.accountNumber}
                            </p>
                          </div>
                        )}
                        {paymentMethod === "momo" && accounts.momo && (
                          <div className="text-xs text-muted-foreground pt-2">
                            <p>
                              <strong>Chủ ví:</strong> {accounts.momo.ownerName}
                            </p>
                            <p>
                              <strong>Số điện thoại:</strong> {accounts.momo.phoneNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingMethods}>
                {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt tour"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ManagePaymentMethodDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        accounts={accounts}
        onSave={handleSaveAccounts}
      />
    </>
  );
}