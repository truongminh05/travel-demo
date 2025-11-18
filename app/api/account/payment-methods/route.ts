import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import supabaseAdmin from "@/lib/supabaseAdmin";

/**
 * Row của bảng UserPaymentMethods theo schema Supabase bạn gửi
 */
interface PaymentMethodRow {
  PaymentMethodID: number;
  UserID: number;
  Type: string;
  BankName: string | null;
  AccountName: string | null;
  AccountNumber: string | null;
  MomoOwner: string | null;
  MomoPhone: string | null;
  // CreatedAt/UpdatedAt không dùng tới nên khỏi khai báo cũng được
}

/**
 * Data trả về cho client: gom thành 2 khối bank + momo
 */
interface PaymentAccountsResponse {
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
}

/**
 * Body mà client gửi lên khi POST
 */
interface PaymentAccountsInput {
  bank?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
  } | null;
  momo?: {
    ownerName?: string;
    phoneNumber?: string;
  } | null;
}

/**
 * Map từ mảng row DB → object gọn cho client
 */
function mapAccounts(rows: PaymentMethodRow[]): PaymentAccountsResponse {
  const result: PaymentAccountsResponse = {};

  for (const row of rows) {
    if (row.Type === "bank") {
      // chỉ map nếu có dữ liệu
      if (row.BankName || row.AccountName || row.AccountNumber) {
        result.bank = {
          id: row.PaymentMethodID,
          bankName: row.BankName ?? "",
          accountName: row.AccountName ?? "",
          accountNumber: row.AccountNumber ?? "",
        };
      }
    } else if (row.Type === "momo") {
      if (row.MomoOwner || row.MomoPhone) {
        result.momo = {
          id: row.PaymentMethodID,
          ownerName: row.MomoOwner ?? "",
          phoneNumber: row.MomoPhone ?? "",
        };
      }
    }
  }

  return result;
}

/**
 * Helper lấy userId từ session (vì bạn dùng Users riêng, không phải Supabase Auth)
 */
function getUserIdFromSession(session: any): number | null {
  if (!session) return null;

  // tuỳ bạn lưu như thế nào trong NextAuth, mình thử lấy lần lượt:
  const raw =
    session.user?.dbUserId ?? session.user?.userId ?? session.user?.id ?? null;

  if (raw == null) return null;

  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

/**
 * GET: lấy thông tin bank + momo hiện tại của user
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserIdFromSession(session as any);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("UserPaymentMethods")
      .select(
        "PaymentMethodID, UserID, Type, BankName, AccountName, AccountNumber, MomoOwner, MomoPhone"
      )
      .eq("UserID", userId);

    if (error) {
      console.error("[account/payment-methods] GET Supabase error", error);
      return NextResponse.json(
        { message: "Failed to load payment methods" },
        { status: 500 }
      );
    }

    const rows = (data ?? []) as PaymentMethodRow[];
    const payload = mapAccounts(rows);

    return NextResponse.json<PaymentAccountsResponse>(payload);
  } catch (error) {
    console.error("[account/payment-methods] GET error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST: cập nhật / tạo mới thông tin bank + momo cho user
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserIdFromSession(session as any);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as PaymentAccountsInput;

    const bank = body.bank ?? null;
    const momo = body.momo ?? null;

    // ========== BANK ==========
    if (bank) {
      const bankName = (bank.bankName ?? "").trim();
      const accountName = (bank.accountName ?? "").trim();
      const accountNumber = (bank.accountNumber ?? "").trim();

      const allEmpty = !bankName && !accountName && !accountNumber;

      const { data: existingBank, error: bankQueryError } = await supabaseAdmin
        .from("UserPaymentMethods")
        .select("PaymentMethodID")
        .eq("UserID", userId)
        .eq("Type", "bank")
        .maybeSingle();

      if (bankQueryError) {
        console.error(
          "[account/payment-methods] POST query bank error",
          bankQueryError
        );
        return NextResponse.json(
          { message: "Failed to update bank info" },
          { status: 500 }
        );
      }

      if (allEmpty) {
        // user xoá sạch → xoá record nếu có
        if (existingBank?.PaymentMethodID) {
          const { error: deleteBankError } = await supabaseAdmin
            .from("UserPaymentMethods")
            .delete()
            .eq("PaymentMethodID", existingBank.PaymentMethodID);

          if (deleteBankError) {
            console.error(
              "[account/payment-methods] DELETE bank error",
              deleteBankError
            );
          }
        }
      } else {
        if (existingBank?.PaymentMethodID) {
          // update
          const { error: updateBankError } = await supabaseAdmin
            .from("UserPaymentMethods")
            .update({
              Type: "bank",
              BankName: bankName,
              AccountName: accountName,
              AccountNumber: accountNumber,
            })
            .eq("PaymentMethodID", existingBank.PaymentMethodID);

          if (updateBankError) {
            console.error(
              "[account/payment-methods] UPDATE bank error",
              updateBankError
            );
            return NextResponse.json(
              { message: "Failed to update bank info" },
              { status: 500 }
            );
          }
        } else {
          // insert mới
          const { error: insertBankError } = await supabaseAdmin
            .from("UserPaymentMethods")
            .insert({
              UserID: userId,
              Type: "bank",
              BankName: bankName,
              AccountName: accountName,
              AccountNumber: accountNumber,
            });

          if (insertBankError) {
            console.error(
              "[account/payment-methods] INSERT bank error",
              insertBankError
            );
            return NextResponse.json(
              { message: "Failed to save bank info" },
              { status: 500 }
            );
          }
        }
      }
    }

    // ========== MOMO ==========
    if (momo) {
      const ownerName = (momo.ownerName ?? "").trim();
      const phoneNumber = (momo.phoneNumber ?? "").trim();

      const allEmpty = !ownerName && !phoneNumber;

      const { data: existingMomo, error: momoQueryError } = await supabaseAdmin
        .from("UserPaymentMethods")
        .select("PaymentMethodID")
        .eq("UserID", userId)
        .eq("Type", "momo")
        .maybeSingle();

      if (momoQueryError) {
        console.error(
          "[account/payment-methods] POST query momo error",
          momoQueryError
        );
        return NextResponse.json(
          { message: "Failed to update momo info" },
          { status: 500 }
        );
      }

      if (allEmpty) {
        if (existingMomo?.PaymentMethodID) {
          const { error: deleteMomoError } = await supabaseAdmin
            .from("UserPaymentMethods")
            .delete()
            .eq("PaymentMethodID", existingMomo.PaymentMethodID);

          if (deleteMomoError) {
            console.error(
              "[account/payment-methods] DELETE momo error",
              deleteMomoError
            );
          }
        }
      } else {
        if (existingMomo?.PaymentMethodID) {
          const { error: updateMomoError } = await supabaseAdmin
            .from("UserPaymentMethods")
            .update({
              Type: "momo",
              MomoOwner: ownerName,
              MomoPhone: phoneNumber,
            })
            .eq("PaymentMethodID", existingMomo.PaymentMethodID);

          if (updateMomoError) {
            console.error(
              "[account/payment-methods] UPDATE momo error",
              updateMomoError
            );
            return NextResponse.json(
              { message: "Failed to update momo info" },
              { status: 500 }
            );
          }
        } else {
          const { error: insertMomoError } = await supabaseAdmin
            .from("UserPaymentMethods")
            .insert({
              UserID: userId,
              Type: "momo",
              MomoOwner: ownerName,
              MomoPhone: phoneNumber,
            });

          if (insertMomoError) {
            console.error(
              "[account/payment-methods] INSERT momo error",
              insertMomoError
            );
            return NextResponse.json(
              { message: "Failed to save momo info" },
              { status: 500 }
            );
          }
        }
      }
    }

    // Sau khi xử lý xong → trả lại trạng thái mới
    const { data: updated, error: reloadError } = await supabaseAdmin
      .from("UserPaymentMethods")
      .select(
        "PaymentMethodID, UserID, Type, BankName, AccountName, AccountNumber, MomoOwner, MomoPhone"
      )
      .eq("UserID", userId);

    if (reloadError) {
      console.error("[account/payment-methods] RELOAD error", reloadError);
      return NextResponse.json(
        { message: "Failed to reload payment methods" },
        { status: 500 }
      );
    }

    const rows = (updated ?? []) as PaymentMethodRow[];
    const payload = mapAccounts(rows);

    return NextResponse.json<PaymentAccountsResponse>(payload);
  } catch (error) {
    console.error("[account/payment-methods] POST error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: xoá theo type (?type=bank|momo)
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserIdFromSession(session as any);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (type !== "bank" && type !== "momo") {
      return NextResponse.json(
        { message: "Invalid type, must be 'bank' or 'momo'" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("UserPaymentMethods")
      .delete()
      .eq("UserID", userId)
      .eq("Type", type);

    if (deleteError) {
      console.error("[account/payment-methods] DELETE error", deleteError);
      return NextResponse.json(
        { message: "Failed to delete payment method" },
        { status: 500 }
      );
    }

    // Trả lại trạng thái mới
    const { data: updated, error: reloadError } = await supabaseAdmin
      .from("UserPaymentMethods")
      .select(
        "PaymentMethodID, UserID, Type, BankName, AccountName, AccountNumber, MomoOwner, MomoPhone"
      )
      .eq("UserID", userId);

    if (reloadError) {
      console.error(
        "[account/payment-methods] RELOAD after delete error",
        reloadError
      );
      return NextResponse.json(
        { message: "Failed to reload payment methods" },
        { status: 500 }
      );
    }

    const rows = (updated ?? []) as PaymentMethodRow[];
    const payload = mapAccounts(rows);

    return NextResponse.json<PaymentAccountsResponse>(payload);
  } catch (error) {
    console.error("[account/payment-methods] DELETE error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
