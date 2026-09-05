import {environmentConfig} from "../../config";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {catchAxiosError} from "../axios.utils";

const { apiUrl } = environmentConfig["api-peru-devs"];

const fetch = axios.create({
  baseURL: apiUrl,
});

fetch.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(catchAxiosError(error))
);

export const get = <T = any>(
    pathname: string,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => fetch.get<T>(pathname, config);

export const post = <T = any>(
    pathname: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => fetch.post<T>(pathname, data, config);