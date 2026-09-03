import { environmentConfig } from "../../config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { catchAxiosError } from "../axios.utils";

const { apiUrl } = environmentConfig["api-peru-devs"];

const fetch = axios.create({
  baseURL: apiUrl,
});

fetch.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(catchAxiosError(error))
);

export const get = <T, R = AxiosResponse<T>>(
  pathname: string,
  config?: AxiosRequestConfig
): Promise<R> => fetch.get<T, R>(pathname, config);

export const post = <T, R = AxiosResponse<T>>(
  pathname: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<R> => fetch.post<T, R>(pathname, data, config);
