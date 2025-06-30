import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { config } from "../config/env";
import type { ApiErrorResponse } from "../utils/errorHandling";

const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      const customError = new Error(data?.message || `Server error: ${status}`);
      (customError as ApiErrorResponse).status = status;
      (customError as ApiErrorResponse).data = data;
      (customError as any).originalError = error;

      throw customError;
    } else if (error.request) {
      throw new Error("Network error - please check your connection");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
);

// Generic API methods
export const api = {
  get: async <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },
};

export { apiClient };
export default api;
