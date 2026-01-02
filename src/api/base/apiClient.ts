import { getToken } from "../../auth/tokenManager";
import type { ApiResponse } from "../../models/base/api-response";
import { httpClient } from "./httpClient";

export async function apiGet<T>(
  url: string,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  if (requiresAuth && !getToken()) {
    return {
      responseStatusCode: 401,
      isError: true,
      successData: null,
      axiosResponse: null,
      errorData: {
        displayMessage: "Authentication required",
        additionalProps: new Map(),
      },
    };
  }

  return httpClient.get<any, ApiResponse<T>>(url);
}

export async function apiPost<T>(
  url: string,
  data: any,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  if (requiresAuth && !getToken()) {
    return {
      responseStatusCode: 401,
      isError: true,
      successData: null,
      axiosResponse: null,
      errorData: {
        displayMessage: "Authentication required",
        additionalProps: new Map(),
      },
    };
  }

  return httpClient.post<any, ApiResponse<T>>(url, data);
}
