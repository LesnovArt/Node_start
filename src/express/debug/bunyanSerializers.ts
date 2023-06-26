import bunyan, { Serializers } from "bunyan";
import { isAxiosError, AxiosError, AxiosResponse } from "axios";

const serializeErr = (err: AxiosError) => ({
  message: err.message,
  name: err.name,
  stack: err.stack,
  response: err.response ? serializeRes(err.response) : {},
});

const serializeRes = (res: AxiosResponse) => ({
  data: res.data,
  statusCode: res.status,
  statusText: res.statusText,
  headers: res.headers,
  request: {
    method: res.config.method,
    url: res.config.url,
    headers: res.config.headers,
  },
});

export const customSerializers: Serializers = {
  err: (obj: AxiosError | unknown) => {
    if (isAxiosError(obj)) return serializeErr(obj);
    else return bunyan.stdSerializers.err(obj);
  },
  res: (obj: AxiosResponse) => serializeRes(obj),
};
