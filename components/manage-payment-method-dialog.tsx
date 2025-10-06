"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentAccounts } from "@/lib/payment-methods";

interface ManagePaymentMethodDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accounts?: PaymentAccounts;
  onSave?: (
    accounts: PaymentAccounts
  ) => Promise<PaymentAccounts> | PaymentAccounts | void;
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

const BANK_OPTIONS = [
  "Vietcombank",
  "Techcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "ACB",
  "MB Bank",
  "Sacombank",
  "TPBank",
  "VPBank",
  "SHB",
  "OCB",
  "HDBank",
];

export function ManagePaymentMethodDialog({
  trigger,
  open: controlledOpen,
  onOpenChange,
  accounts,
  onSave,
}: ManagePaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState<BankFormState>(defaultBank);
  const [bankOption, setBankOption] = useState<string>("none");
  const [momo, setMomo] = useState<MomoFormState>(defaultMomo);
  const [isSaving, setIsSaving] = useState(false);

  const isControlled = typeof controlledOpen === "boolean";
  const dialogOpen = isControlled ? controlledOpen : open;

  const bankOptions = useMemo(() => {
    const unique = new Set(BANK_OPTIONS);
    if (accounts?.bank?.bankName) {
      unique.add(accounts.bank.bankName);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [accounts?.bank?.bankName]);

  useEffect(() => {
    if (!dialogOpen) return;

    if (accounts?.bank) {
      const existingOption = bankOptions.find(
        (option) =>
          option.toLowerCase() === accounts.bank!.bankName.toLowerCase()
      );
      setBankOption(existingOption ?? "other");
      setBank({
        bankName: accounts.bank.bankName ?? "",
        accountName: accounts.bank.accountName ?? "",
        accountNumber: accounts.bank.accountNumber ?? "",
      });
    } else {
      setBankOption("none");
      setBank({ ...defaultBank });
    }

    if (accounts?.momo) {
      setMomo({
        ownerName: accounts.momo.ownerName ?? "",
        phoneNumber: accounts.momo.phoneNumber ?? "",
      });
    } else {
      setMomo(defaultMomo);
    }
  }, [accounts, bankOptions, dialogOpen]);

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setOpen(next);
    onOpenChange?.(next);
  };

  const trimmedBankName = (
    bankOption && bankOption !== "other" && bankOption !== "none"
      ? bankOption
      : bank.bankName
  ).trim();
  const trimmedBankAccountName = bank.accountName.trim();
  const trimmedBankAccountNumber = bank.accountNumber.replace(/\s+/g, "").trim();
  const bankFilled = (
    bankOption !== "none" &&
    Boolean(
      trimmedBankName || trimmedBankAccountName || trimmedBankAccountNumber
    )
  );
  const bankValid =
    !bankFilled ||
    (Boolean(trimmedBankName) &&
      Boolean(trimmedBankAccountName) &&
      Boolean(trimmedBankAccountNumber));

  const trimmedMomoOwner = momo.ownerName.trim();
  const trimmedMomoPhone = momo.phoneNumber.replace(/\s+/g, "").trim();
  const momoFilled = Boolean(trimmedMomoOwner || trimmedMomoPhone);
  const momoValid =
    !momoFilled || (Boolean(trimmedMomoOwner) && Boolean(trimmedMomoPhone));

  const canSave = bankValid && momoValid;

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    const nextAccounts: PaymentAccounts = {};

    if (bankFilled) {
      nextAccounts.bank = {
        bankName: trimmedBankName,
        accountName: trimmedBankAccountName,
        accountNumber: trimmedBankAccountNumber,
      };
    }

    if (momoFilled) {
      nextAccounts.momo = {
        ownerName: trimmedMomoOwner,
        phoneNumber: trimmedMomoPhone,
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
          const matched = bankOptions.find(
            (option) =>
              option.toLowerCase() === result.bank!.bankName.toLowerCase()
          );
          setBankOption(matched ?? "other");
        } else {
          setBank({ ...defaultBank });
          setBankOption("none");
        }
        if (result.momo) {
          setMomo({
            ownerName: result.momo.ownerName ?? "",
            phoneNumber: result.momo.phoneNumber ?? "",
          });
        } else {
          setMomo(defaultMomo);
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
              <Label>Chọn ngân hàng</Label>
              <Select
                value={bankOption}
                onValueChange={(value) => {
                  setBankOption(value);
                  if (value === "none") {
                    setBank({ ...defaultBank });
                  } else if (value !== "other") {
                    setBank((prev) => ({ ...prev, bankName: value }));
                  } else {
                    setBank((prev) => ({ ...prev, bankName: "" }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngân hàng thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không lưu</SelectItem>
                  {bankOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {bankOption === "other" ? (
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
            ) : null}
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
            {bankFilled && !bankValid ? (
              <p className="text-xs text-destructive">
                Vui lòng cung cấp đầy đủ tên ngân hàng, chủ tài khoản và số tài khoản.
              </p>
            ) : null}
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
            {momoFilled && !momoValid ? (
              <p className="text-xs text-destructive">
                Cần nhập đầy đủ tên chủ ví và số điện thoại.
              </p>
            ) : null}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !canSave}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



