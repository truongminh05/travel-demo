export type BankAccount = {
  id?: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export type MomoAccount = {
  id?: number;
  ownerName: string;
  phoneNumber: string;
};

export type PaymentAccounts = {
  bank?: BankAccount;
  momo?: MomoAccount;
};

const API_ENDPOINT = "/api/account/payment-methods";

type ApiResponse = {
  bank?: Partial<BankAccount>;
  momo?: Partial<MomoAccount>;
};

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const mapAccounts = (payload: ApiResponse | null | undefined): PaymentAccounts => {
  const result: PaymentAccounts = {};
  if (payload?.bank) {
    const bankId = toNumber((payload.bank as any)?.id ?? (payload.bank as any)?.paymentMethodId);
    if (
      payload.bank.bankName &&
      payload.bank.accountName &&
      payload.bank.accountNumber
    ) {
      result.bank = {
        id: bankId,
        bankName: payload.bank.bankName,
        accountName: payload.bank.accountName,
        accountNumber: payload.bank.accountNumber,
      };
    }
  }

  if (payload?.momo) {
    const momoId = toNumber((payload.momo as any)?.id ?? (payload.momo as any)?.paymentMethodId);
    if (payload.momo.ownerName && payload.momo.phoneNumber) {
      result.momo = {
        id: momoId,
        ownerName: payload.momo.ownerName,
        phoneNumber: payload.momo.phoneNumber,
      };
    }
  }

  return result;
};

const parseJson = async (response: Response) => {
  try {
    return (await response.json()) as ApiResponse;
  } catch {
    return {} as ApiResponse;
  }
};

export const loadPaymentMethods = async (): Promise<PaymentAccounts> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      return {};
    }

    if (!response.ok) {
      console.error("[payment-methods] GET failed", response.statusText);
      return {};
    }

    const payload = await parseJson(response);
    return mapAccounts(payload);
  } catch (error) {
    console.error("[payment-methods] load error", error);
    return {};
  }
};

type SavePayload = {
  bank?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  } | null;
  momo?: {
    ownerName: string;
    phoneNumber: string;
  } | null;
};

const normalizeSavePayload = (value: PaymentAccounts): SavePayload => {
  const payload: SavePayload = {};
  if (value.bank) {
    payload.bank = {
      bankName: value.bank.bankName,
      accountName: value.bank.accountName,
      accountNumber: value.bank.accountNumber,
    };
  } else {
    payload.bank = null;
  }

  if (value.momo) {
    payload.momo = {
      ownerName: value.momo.ownerName,
      phoneNumber: value.momo.phoneNumber,
    };
  } else {
    payload.momo = null;
  }

  return payload;
};

export const savePaymentMethods = async (
  value: PaymentAccounts
): Promise<PaymentAccounts> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizeSavePayload(value)),
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorPayload = await parseJson(response);
      throw new Error(
        (errorPayload as unknown as { message?: string })?.message ??
          "Không thể lưu phương thức thanh toán"
      );
    }

    const payload = await parseJson(response);
    return mapAccounts(payload);
  } catch (error) {
    console.error("[payment-methods] save error", error);
    throw error instanceof Error
      ? error
      : new Error("Đã xảy ra lỗi khi lưu phương thức thanh toán");
  }
};

export const deletePaymentMethod = async (type: "bank" | "momo") => {
  try {
    const response = await fetch(`${API_ENDPOINT}?type=${type}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok && response.status !== 404) {
      console.error("[payment-methods] delete failed", response.statusText);
    }
  } catch (error) {
    console.error("[payment-methods] delete error", error);
  }
};