import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

type PaymentMethodRow = {
  PaymentMethodID: number;
  UserID: number;
  Type: string;
  BankName: string | null;
  AccountName: string | null;
  AccountNumber: string | null;
  MomoOwner: string | null;
  MomoPhone: string | null;
};

type PaymentAccountsResponse = {
  bank?: {
    id: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  momo?: {
    id: number;
    ownerName: string;
    phoneNumber: string;
  };
};

const mapAccounts = (
  rows: PaymentMethodRow[] | null | undefined
): PaymentAccountsResponse => {
  const result: PaymentAccountsResponse = {};
  (rows ?? []).forEach((row) => {
    if (row.Type === "bank") {
      if (row.BankName && row.AccountName && row.AccountNumber) {
        result.bank = {
          id: row.PaymentMethodID,
          bankName: row.BankName,
          accountName: row.AccountName,
          accountNumber: row.AccountNumber,
        };
      }
    } else if (row.Type === "momo") {
      if (row.MomoOwner && row.MomoPhone) {
        result.momo = {
          id: row.PaymentMethodID,
          ownerName: row.MomoOwner,
          phoneNumber: row.MomoPhone,
        };
      }
    }
  });

  return result;
};

type BankPayload = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

type MomoPayload = {
  ownerName: string;
  phoneNumber: string;
};

type SavePayload = {
  bank?: Partial<BankPayload> | null;
  momo?: Partial<MomoPayload> | null;
};

const parseBankPayload = (value: unknown): BankPayload | null => {
  if (value == null) return null;
  if (typeof value !== "object") {
    throw new Error("Dữ liệu tài khoản ngân hàng không hợp lệ");
  }

  const { bankName, accountName, accountNumber } = value as {
    bankName?: unknown;
    accountName?: unknown;
    accountNumber?: unknown;
  };

  const normalized: BankPayload = {
    bankName: typeof bankName === "string" ? bankName.trim() : "",
    accountName: typeof accountName === "string" ? accountName.trim() : "",
    accountNumber:
      typeof accountNumber === "string"
        ? accountNumber.replace(/\s+/g, "").trim()
        : "",
  };

  const hasAny =
    normalized.bankName !== "" ||
    normalized.accountName !== "" ||
    normalized.accountNumber !== "";

  if (!hasAny) return null;

  if (
    !normalized.bankName ||
    !normalized.accountName ||
    !normalized.accountNumber
  ) {
    throw new Error(
      "Vui lòng điền đầy đủ thông tin ngân hàng (tên ngân hàng, chủ tài khoản, số tài khoản)."
    );
  }

  return normalized;
};

const parseMomoPayload = (value: unknown): MomoPayload | null => {
  if (value == null) return null;
  if (typeof value !== "object") {
    throw new Error("Dữ liệu tài khoản MoMo không hợp lệ");
  }

  const { ownerName, phoneNumber } = value as {
    ownerName?: unknown;
    phoneNumber?: unknown;
  };

  const normalized: MomoPayload = {
    ownerName: typeof ownerName === "string" ? ownerName.trim() : "",
    phoneNumber:
      typeof phoneNumber === "string"
        ? phoneNumber.replace(/\s+/g, "").trim()
        : "",
  };

  const hasAny =
    normalized.ownerName !== "" || normalized.phoneNumber !== "";
  if (!hasAny) return null;

  if (!normalized.ownerName || !normalized.phoneNumber) {
    throw new Error(
      "Vui lòng điền đầy đủ thông tin MoMo (tên chủ ví, số điện thoại)."
    );
  }

  return normalized;
};

const resolveUserId = async (): Promise<number | null> => {
  const session = await getServerSession(authOptions);
  const userIdRaw =
    (session?.user as { id?: string | number | null } | undefined)?.id ?? null;

  if (userIdRaw == null) {
    return null;
  }

  const userId = Number(userIdRaw);
  return Number.isFinite(userId) ? userId : null;
};

export async function GET() {
  const userId = await resolveUserId();
  if (userId == null) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("UserPaymentMethods")
      .select(
        "PaymentMethodID, Type, BankName, AccountName, AccountNumber, MomoOwner, MomoPhone"
      )
      .eq("UserID", userId);

    if (error) {
      throw error;
    }

    return NextResponse.json(mapAccounts(data));
  } catch (error) {
    console.error("[account/payment-methods] GET error", error);
    return NextResponse.json(
      { message: "Không thể tải phương thức thanh toán" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const userId = await resolveUserId();
  if (userId == null) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => ({}))) as SavePayload;

  let bankPayload: BankPayload | null = null;
  let momoPayload: MomoPayload | null = null;

  try {
    bankPayload = parseBankPayload(payload.bank ?? null);
    momoPayload = parseMomoPayload(payload.momo ?? null);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("UserPaymentMethods")
      .select("PaymentMethodID, Type")
      .eq("UserID", userId);

    if (fetchError) {
      throw fetchError;
    }

    const existingBank = (existing ?? []).find((row) => row.Type === "bank");
    const existingMomo = (existing ?? []).find((row) => row.Type === "momo");

    if (bankPayload) {
      if (existingBank) {
        const { error: updateBankError } = await supabaseAdmin
          .from("UserPaymentMethods")
          .update({
            BankName: bankPayload.bankName,
            AccountName: bankPayload.accountName,
            AccountNumber: bankPayload.accountNumber,
            UpdatedAt: new Date().toISOString(),
          })
          .eq("PaymentMethodID", existingBank.PaymentMethodID);

        if (updateBankError) {
          throw updateBankError;
        }
      } else {
        const { error: insertBankError } = await supabaseAdmin
          .from("UserPaymentMethods")
          .insert({
            UserID: userId,
            Type: "bank",
            BankName: bankPayload.bankName,
            AccountName: bankPayload.accountName,
            AccountNumber: bankPayload.accountNumber,
          });

        if (insertBankError) {
          throw insertBankError;
        }
      }
    } else if (existingBank) {
      const { error: deleteBankError } = await supabaseAdmin
        .from("UserPaymentMethods")
        .delete()
        .eq("PaymentMethodID", existingBank.PaymentMethodID);

      if (deleteBankError) {
        throw deleteBankError;
      }
    }

    if (momoPayload) {
      if (existingMomo) {
        const { error: updateMomoError } = await supabaseAdmin
          .from("UserPaymentMethods")
          .update({
            MomoOwner: momoPayload.ownerName,
            MomoPhone: momoPayload.phoneNumber,
            UpdatedAt: new Date().toISOString(),
          })
          .eq("PaymentMethodID", existingMomo.PaymentMethodID);

        if (updateMomoError) {
          throw updateMomoError;
        }
      } else {
        const { error: insertMomoError } = await supabaseAdmin
          .from("UserPaymentMethods")
          .insert({
            UserID: userId,
            Type: "momo",
            MomoOwner: momoPayload.ownerName,
            MomoPhone: momoPayload.phoneNumber,
          });

        if (insertMomoError) {
          throw insertMomoError;
        }
      }
    } else if (existingMomo) {
      const { error: deleteMomoError } = await supabaseAdmin
        .from("UserPaymentMethods")
        .delete()
        .eq("PaymentMethodID", existingMomo.PaymentMethodID);

      if (deleteMomoError) {
        throw deleteMomoError;
      }
    }

    const { data: updated, error: updatedError } = await supabaseAdmin
      .from("UserPaymentMethods")
      .select(
        "PaymentMethodID, Type, BankName, AccountName, AccountNumber, MomoOwner, MomoPhone"
      )
      .eq("UserID", userId);

    if (updatedError) {
      throw updatedError;
    }

    return NextResponse.json(mapAccounts(updated));
  } catch (error) {
    console.error("[account/payment-methods] POST error", error);
    return NextResponse.json(
      { message: "Không thể lưu phương thức thanh toán" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const userId = await resolveUserId();
  if (userId == null) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (type !== "bank" && type !== "momo") {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from("UserPaymentMethods")
      .delete()
      .eq("UserID", userId)
      .eq("Type", type);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[account/payment-methods] DELETE error", error);
    return NextResponse.json(
      { message: "Không thể xoá phương thức thanh toán" },
      { status: 500 }
    );
  }
}