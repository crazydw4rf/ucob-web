// TODO: kumpulan fungsi untuk memanggil REST API untuk keperluan mengambil dan memperbarui informasi pengguna

import type { AxiosResponse } from "axios";
import ApiRequest from "../api";

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

function isAxiosResponse(o: any): o is AxiosResponse {
  return o && typeof o === "object" && "status" in o && "headers" in o;
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const response = await ApiRequest("/users").postRequest(payload);

    return {
      code: response?.status ?? 500,
      data: isAxiosResponse(response) ? response.data : response,
      success: isAxiosResponse(response) ? (response.data?.success ?? false) : false,
    };
  } catch (error: any) {
    return {
      code: error?.response?.status ?? 500,
      data: error?.response?.data ?? null,
      success: false,
    };
  }
}

export async function ambilDataUser() {
  try {
    const response = await ApiRequest("/users/me").getRequest();
    let payload = isAxiosResponse(response) ? response.data : response;

    if (typeof payload != "object") {
      payload = JSON.parse(payload);
    }

    if (!payload?.success) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function checkAuth() {
  try {
    return await ambilDataUser();
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}
