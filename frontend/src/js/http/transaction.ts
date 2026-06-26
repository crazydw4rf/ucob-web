import type { AxiosResponse } from "axios";
import ApiRequest from "../api";

export type TransactionType = "Purchase" | "Sale";

export type CreateTransactionPayload = {
  oil_volume: number;
  transaction_type: TransactionType;
  address_district: string;
  address_village: string;
  address_details: string;
  sale_image_url?: string | null;
};

export type Transaction = {
  id: number;
  oil_volume: number;
  status: string;
  transaction_type: TransactionType;
  user_id: number;
  payment_id: number | null;
  created_at: string;
  address_district?: string;
  address_village?: string;
  address_details?: string;
};

function isAxiosResponse(o: any): o is AxiosResponse {
  return o && typeof o === "object" && "status" in o && "headers" in o;
}

function parsePayload(response: any) {
  let payload = isAxiosResponse(response) ? response.data : response;
  if (typeof payload === "string") {
    payload = JSON.parse(payload);
  }
  return payload;
}

export async function createTransaction(payload: CreateTransactionPayload) {
  try {
    const response = await ApiRequest("/transaction").postRequest(payload);
    const result = parsePayload(response);
    return {
      success: result?.success ?? isAxiosResponse(response),
      code: result?.code ?? response?.status ?? 500,
      data: result?.data ?? null,
      error: result?.error ?? null,
    };
  } catch (error: any) {
    return {
      success: false,
      code: error?.response?.status ?? 500,
      data: null,
      error: error?.response?.data?.error ?? { message: error?.message || "Failed to create transaction" },
    };
  }
}

export async function getTransactions(page = 1, pageSize = 50) {
  try {
    const response = await ApiRequest("/transaction").getRequest({
      page,
      page_size: pageSize,
    });
    const result = parsePayload(response);

    if (!result?.success) {
      return [];
    }

    return (result.data ?? []) as Transaction[];
  } catch {
    return [];
  }
}

export async function getAdminTransactions(page = 1, pageSize = 20) {
  try {
    const response = await ApiRequest("/transaction/admin").getRequest({
      page,
      page_size: pageSize,
    });
    const result = parsePayload(response);

    if (!result?.success) {
      return { items: [] as Transaction[], total: 0 };
    }

    const items = (result.data ?? []) as Transaction[];
    const total = result.meta?.pagination?.total ?? items.length;

    return { items, total };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getTransactionById(id: number) {
  try {
    const response = await ApiRequest(`/transaction/${id}`).getRequest();
    const result = parsePayload(response);

    if (!result?.success) {
      return null;
    }

    return result.data as Transaction;
  } catch {
    return null;
  }
}

export function buildAddressPayload(fullAddress: string) {
  const trimmed = fullAddress.trim();
  return {
    address_district: "-",
    address_village: "-",
    address_details: trimmed,
  };
}

export function formatTransactionAddress(tx: Transaction) {
  const parts = [tx.address_details, tx.address_village, tx.address_district]
    .filter((part) => part && part !== "-")
    .map((part) => part!.trim());

  return parts.length ? parts.join(", ") : "-";
}
