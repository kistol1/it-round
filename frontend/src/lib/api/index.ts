import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AppApi } from "@/types/api";

const defaultHeaders = {
  "Accept-Language": "ru",
  "Content-type": "application/json",
};

const createRequestInstance = (): AppApi => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
    headers: defaultHeaders,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
      const originalRequest: InternalAxiosRequestConfig<unknown> | undefined =
        error.config;
      console.log(error);

      if (
        error?.response?.data &&
        typeof error?.response?.data === "object" &&
        "message" in error.response.data
      )
        throw error?.response?.data?.message;
      if (!originalRequest || !originalRequest.method || !originalRequest.url)
        throw error;
      if (error.status === 500) {
        console.error("Сервер не доступен: ", JSON.stringify(error));
        return;
      }
      throw error.message;
    }
  );
  return instance as AppApi;
};

export const request = createRequestInstance();
