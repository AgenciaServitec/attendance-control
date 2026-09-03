import axios, { AxiosError } from "axios";
import assert from "assert";
import { logger } from "../utils";

export const catchAxiosError = (axiosError: unknown): AxiosError => {
  // @ts-ignore
  // eslint-disable-next-line import/no-named-as-default-member
  assert(axios.isAxiosError(axiosError), "Is not axios error");

  const message = getMessage(axiosError);

  logger.warn(message, mapAxiosLog(axiosError));

  axiosError.stack = `${message} | ${axiosError.stack}`;

  return axiosError;
};

const getMessage = ({ config, response }: AxiosError): string =>
  `Axios: ${config?.baseURL} | ${config?.url} | ${response?.status}: ${response?.statusText}`;

const mapAxiosLog = ({ config, response, request, message }: AxiosError) => {
  const log: ObjectType = {};

  if (response) {
    log.response = response;
  } else if (request) {
    log.request = request;
  } else {
    log.message = message;
  }

  log.config = config;

  return log;
};
