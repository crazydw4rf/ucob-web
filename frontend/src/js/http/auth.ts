import ApiRequest from "../api";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function logoutUser() {
  try {
    await ApiRequest("/auth/logout").postRequest({});
    return { success: true };
  } catch (error: any) {
    const errMessage = error?.response?.data?.error?.message || error?.message || "Logout failed";
    return { success: false, error: { message: errMessage } };
  }
}

export async function loginUser(payload: LoginPayload) {
  try {
    const response = await ApiRequest("/auth/login").postRequest(payload);
    const responseData = response?.data ?? response;

    if (typeof responseData === "string") {
      try {
        return JSON.parse(responseData);
      } catch {
        return responseData;
      }
    }

    return responseData;
  } catch (error: any) {
    const errMessage = error?.response?.data?.error?.message || error?.message || "Login failed";
    return { success: false, error: { message: errMessage } };
  }
}
