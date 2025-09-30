"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PaymentAccounts } from "@/lib/payment-methods";

interface ManagePaymentMethodDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accounts?: PaymentAccounts;
  onSave?: (accounts: PaymentAccounts) => Promise<PaymentAccounts> | PaymentAccounts | void;
}

type BankFormState = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

type MomoFormState = {
  ownerName: string;
  phoneNumber: string;
};

const defaultBank: BankFormState = {
  bankName: "",
  accountName: "",
  accountNumber: "",
};

const defaultMomo: MomoFormState = {
  ownerName: "",
  phoneNumber: "",
};

export function ManagePaymentMethodDialog({
  trigger,
  open: controlledOpen,
  onOpenChange,
  accounts,
  onSave,
}: ManagePaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState<BankFormState>(defaultBank);
  const [momo, setMomo] = useState<MomoFormState>(defaultMomo);
  const [isSaving, setIsSaving] = useState(false);

  const isControlled = typeof controlledOpen === "boolean";
  const dialogOpen = isControlled ? controlledOpen : open;

  useEffect(() => {
    if (!dialogOpen) return;
    if (accounts?.bank) {
      setBank({
        bankName: accounts.bank.bankName ?? "",
        accountName: accounts.bank.accountName ?? "",
        accountNumber: accounts.bank.accountNumber ?? "",
      });
    } else {
      setBank(defaultBank);
    }

    if (accounts?.momo) {
      setMomo({
        ownerName: accounts.momo.ownerName ?? "",
        phoneNumber: accounts.momo.phoneNumber ?? "",
      });
    } else {
      setMomo(defaultMomo);
    }
  }, [accounts, dialogOpen]);

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setOpen(next);
    onOpenChange?.(next);
  };

  const handleSave = async () => {
    const trimmedBank: BankFormState = {
      bankName: bank.bankName.trim(),
      accountName: bank.accountName.trim(),
      accountNumber: bank.accountNumber.replace(/\s+/g, "").trim(),
    };

    const trimmedMomo: MomoFormState = {
      ownerName: momo.ownerName.trim(),
      phoneNumber: momo.phoneNumber.replace(/\s+/g, "").trim(),
    };

    const nextAccounts: PaymentAccounts = {};

    if (
      trimmedBank.bankName ||
      trimmedBank.accountName ||
      trimmedBank.accountNumber
    ) {
      nextAccounts.bank = {
        bankName: trimmedBank.bankName,
        accountName: trimmedBank.accountName,
        accountNumber: trimmedBank.accountNumber,
      };
    }

    if (trimmedMomo.ownerName || trimmedMomo.phoneNumber) {
      nextAccounts.momo = {
        ownerName: trimmedMomo.ownerName,
        phoneNumber: trimmedMomo.phoneNumber,
      };
    }

    try {
      setIsSaving(true);
      const result = await onSave?.(nextAccounts);
      if (result && typeof result === "object") {
        if (result.bank) {
          setBank({
            bankName: result.bank.bankName ?? "",
            accountName: result.bank.accountName ?? "",
            accountNumber: result.bank.accountNumber ?? "",
          });
        }
        if (result.momo) {
          setMomo({
            ownerName: result.momo.ownerName ?? "",
            phoneNumber: result.momo.phoneNumber ?? "",
          });
        }
      }
      handleOpenChange(false);
    } catch (error) {
      console.error("[ManagePaymentMethodDialog] save error", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý phương thức thanh toán</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin tài khoản ngân hàng hoặc ví MoMo để hoàn tất đặt cọc nhanh chóng.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="bank" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="bank">Ngân hàng</TabsTrigger>
            <TabsTrigger value="momo">MoMo</TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Tên ngân hàng</Label>
              <Input
                id="bankName"
                value={bank.bankName}
                onChange={(event) =>
                  setBank((prev) => ({ ...prev, bankName: event.target.value }))
                }
                placeholder="Ví dụ: Vietcombank"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Chủ tài khoản</Label>
              <Input
                id="accountName"
                value={bank.accountName}
                onChange={(event) =>
                  setBank((prev) => ({ ...prev, accountName: event.target.value }))
                }
                placeholder="Tên đầy đủ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Số tài khoản</Label>
              <Input
                id="accountNumber"
                value={bank.accountNumber}
                onChange={(event) =>
                  setBank((prev) => ({ ...prev, accountNumber: event.target.value }))
                }
                placeholder="Nhập số tài khoản"
              />
            </div>
          </TabsContent>

          <TabsContent value="momo" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="momoOwner">Chủ tài khoản MoMo</Label>
              <Input
                id="momoOwner"
                value={momo.ownerName}
                onChange={(event) =>
                  setMomo((prev) => ({ ...prev, ownerName: event.target.value }))
                }
                placeholder="Tên chủ ví"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="momoPhone">Số điện thoại MoMo</Label>
              <Input
                id="momoPhone"
                value={momo.phoneNumber}
                onChange={(event) =>
                  setMomo((prev) => ({ ...prev, phoneNumber: event.target.value }))
                }
                placeholder="Ví dụ: 0901 234 567"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}