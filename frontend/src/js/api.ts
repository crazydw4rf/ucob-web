import { API_URL } from "./constants";
import axios, { type AxiosResponse } from "axios";

class ApiWrapper<T = any> {
  #endpoint;
  #axios;

  constructor(endpoint: string) {
    this.#axios = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      withCredentials: true,
    });

    this.#endpoint = endpoint;
  }

  async getRequest(params?: Record<string, string | number>) {
    return await this.#axios.get<T>(this.#endpoint, { params });
  }

  async postRequest(payload: object = {}) {
    return await this.#axios.post<T>(this.#endpoint, payload);
  }
}

/**
 * @param {string} endpoint contoh endpoint "/users/1"
 */
export function ApiRequest<T = any>(endpoint: string): ApiWrapper<T> {
  return new ApiWrapper(endpoint);
}

export default ApiRequest;
