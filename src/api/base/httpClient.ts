import axios from "axios";
import { environment } from "../../environment";
import { getToken } from "../../auth/tokenManager";

export const httpClient = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: 15000,
});

// Request interceptor
httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – force ApiResponse<T>
httpClient.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    if (error.response?.data) {
      return Promise.resolve(error.response.data);
    }

    return Promise.resolve({
      responseStatusCode: 500,
      isError: true,
      successData: undefined,
      errorData: {
        displayMessage: error.message,

        additionalProps: new Map(),
      },
    });
  }
);
