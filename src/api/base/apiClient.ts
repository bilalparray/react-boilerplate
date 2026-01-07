import { getToken } from "../../auth/tokenManager";
import type { ApiResponse } from "../../models/base/api-response";
import { httpClient } from "./httpClient";

/* ----------------------------------------------------
   GET
---------------------------------------------------- */
export async function apiGet<T>(
  url: string,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  if (requiresAuth && !getToken()) {
    return unauthorizedResponse<T>();
  }

  return httpClient.get<any, ApiResponse<T>>(url);
}

/* ----------------------------------------------------
   POST
---------------------------------------------------- */
export async function apiPost<T>(
  url: string,
  data: any,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  if (requiresAuth && !getToken()) {
    return unauthorizedResponse<T>();
  }

  return httpClient.post<any, ApiResponse<T>>(url, data);
}

/* ----------------------------------------------------
   PUT
---------------------------------------------------- */
export async function apiPut<T>(
  url: string,
  data: any,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  if (requiresAuth && !getToken()) {
    return unauthorizedResponse<T>();
  }

  return httpClient.put<any, ApiResponse<T>>(url, data);
}

/* ----------------------------------------------------
   DELETE
---------------------------------------------------- */
export async function apiDelete<T>(
  url: string,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  if (requiresAuth && !getToken()) {
    return unauthorizedResponse<T>();
  }

  return httpClient.delete<any, ApiResponse<T>>(url);
}

/* ----------------------------------------------------
   Shared Unauthorized Handler
---------------------------------------------------- */
function unauthorizedResponse<T>(): ApiResponse<T> {
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
