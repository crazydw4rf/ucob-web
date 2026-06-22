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
  const response = await ApiRequest("/users").postRequest(payload);

  return {
    code: response?.status ?? 500,
    data: isAxiosResponse(response) ? response.data : response,
    success: isAxiosResponse(response) ? (response.data?.success ?? false) : false,
  };
}

export async function ambilDataUser() {
  const response = await ApiRequest("/users/me").getRequest();
  const payload = isAxiosResponse(response) ? response.data : response;

  console.log(response);
  console.log(payload);

  if (!payload?.success) {
    return null;
  }

  return JSON.parse(payload);
}

export async function checkAuth() {
  try {
    return await ambilDataUser();
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}
