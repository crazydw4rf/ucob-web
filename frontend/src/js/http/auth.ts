import ApiRequest from "../api";

export async function ambilDataUser() {
  const response = await ApiRequest("/users/me").getRequest();
  const payload = response.data;

  if (!payload?.success) {
    return null;
  }

  return payload.data;
}

export async function checkAuth() {
  try {
    return await ambilDataUser();
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}
