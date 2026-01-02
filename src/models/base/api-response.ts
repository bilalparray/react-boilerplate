import type { AxiosResponse } from "axios";
import type { ErrorData } from "./error-data";

export interface ApiResponse<T> {
  responseStatusCode: number;
  isError: boolean;
  successData: T | null;
  axiosResponse: AxiosResponse<any, any, {}> | null;
  errorData: ErrorData;
}
