"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ManagePaymentMethodDialog } from "@/components/manage-payment-method-dialog";
import {
  loadPaymentMethods,
  savePaymentMethods,
  type PaymentAccounts,
} from "@/lib/payment-methods";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";

export default function AddPaymentMethodPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(true);
  const [accounts, setAccounts] = useState<PaymentAccounts>({});
  const [isSaving, setIsSaving] = useState(false);
  const [initialised, setInitialised] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const returnUrl = useMemo(
    () => searchParams.get("returnUrl") || "/account",
    [searchParams]
  );
  const preferred = searchParams.get("preferred");

  useEffect(() => {
    if (status === "unauthenticated") {
      if (typeof window !== "undefined") {
        router.push(
          `/login?redirect=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
      }
    }
  }, [status, router, searchParams]);

  useEffect(() => {
    if (status !== "authenticated" || initialised) {
      return;
    }

    let active = true;
    const initialise = async () => {
      try {
        const methods = await loadPaymentMethods();
        if (!active) return;
        setAccounts(methods);
      } catch (error) {
        console.error("[AddPaymentMethodPage] load error", error);
      } finally {
        if (active) {
          setInitialised(true);
          setDialogOpen(true);
        }
      }
    };

    void initialise();

    return () => {
      active = false;
    };
  }, [status, initialised]);

  const handleSave = async (next: PaymentAccounts) => {
    setIsSaving(true);
    try {
      const updated = await savePaymentMethods(next);
      setAccounts(updated);
      setHasSaved(true);
      toast({ title: "Đã lưu phương thức thanh toán" });
      return updated;
    } catch (error) {
      toast({
        title: "Không thể lưu phương thức thanh toán",
        description:
          error instanceof Error ? error.message : "Vui lòng thử lại sau.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
    router.replace(returnUrl);
    }
  };

  const continueHref = useMemo(() => {
    const redirect = returnUrl || "/account";
    const params = new URLSearchParams();
    const guests = searchParams.get("guests");
    const departureDate = searchParams.get("departureDate");
    const preferredMethod =
      preferred && ["bank", "momo", "consultation"].includes(preferred)
        ? preferred
        : undefined;

    if (guests) params.set("guests", guests);
    if (departureDate) params.set("departureDate", departureDate);
    if (preferredMethod) params.set("preferred", preferredMethod);

    const url = params.toString()
      ? `${redirect}?${params.toString()}`
      : redirect;
    return url;
  }, [returnUrl, searchParams, preferred]);

  return (
    <div className="container max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Thêm phương thức thanh toán</CardTitle>
          <CardDescription>
            Cập nhật tài khoản ngân hàng hoặc ví MoMo để tiếp tục đặt tour.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTitle>Chưa tìm thấy phương thức thanh toán</AlertTitle>
            <AlertDescription>
              Để tiến hành đặt tour, vui lòng thêm tối thiểu một tài khoản thanh
              toán. Bạn có thể cập nhật cả ngân hàng và ví MoMo để thuận tiện
              hơn trong tương lai.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
            <p>
              Sau khi lưu, hệ thống sẽ đưa bạn trở lại bước đặt tour để hoàn tất
              thanh toán hoặc gửi yêu cầu tư vấn.
            </p>
            <p>
              Nếu bạn chỉ muốn gửi yêu cầu tư vấn mà không thanh toán online,
              vẫn nên lưu thông tin để sử dụng cho lần đặt tour tiếp theo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setDialogOpen(true)} disabled={dialogOpen}>
              {dialogOpen ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" /> Đang mở biểu
                  mẫu
                </span>
              ) : (
                "Thêm phương thức mới"
              )}
            </Button>
            <Button variant="outline" onClick={() => router.replace(returnUrl)}>
              Quay lại tài khoản
            </Button>
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            <p className="font-medium text-foreground">Phương thức đã lưu</p>
            {accounts.bank || accounts.momo ? (
              <div className="grid gap-3 md:grid-cols-2">
                {accounts.bank ? (
                  <div className="rounded-md border p-3">
                    <p className="font-medium">Ngân hàng</p>
                    <p className="text-muted-foreground text-sm">
                      {accounts.bank.bankName} · {accounts.bank.accountName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      STK: {accounts.bank.accountNumber}
                    </p>
                  </div>
                ) : null}
                {accounts.momo ? (
                  <div className="rounded-md border p-3">
                    <p className="font-medium">Ví MoMo</p>
                    <p className="text-muted-foreground text-sm">
                      {accounts.momo.ownerName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      SĐT: {accounts.momo.phoneNumber}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Bạn chưa lưu phương thức thanh toán nào.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                if (!hasSaved) {
                  toast({
                    title: "Chưa lưu phương thức thanh toán",
                    description:
                      "Vui lòng lưu ít nhất một phương thức trước khi tiếp tục.",
                    variant: "destructive",
                  });
                  return;
                }
                router.push(continueHref);
              }}
            >
              {hasSaved ? "Tiếp tục đặt tour" : "Lưu phương thức để tiếp tục"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Sau khi lưu thành công, bạn có thể quay lại bước đặt tour ngay lập
              tức.
            </p>
          </div>
        </CardContent>
      </Card>

      <ManagePaymentMethodDialog
        open={dialogOpen}
        onOpenChange={handleClose}
        accounts={accounts}
        onSave={handleSave}
      />
    </div>
  );
}
