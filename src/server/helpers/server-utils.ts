import { ServerResponse } from "http";
import url from "node:url";

import { METHOD } from "../types/server";
import { restHandlers } from "../rest/users";
import { MAX_AGE } from "../constants";

export const isGet = (method?: string) => method === METHOD.GET;
export const isPost = (method?: string) => method === METHOD.POST;
export const isDelete = (method?: string) => method === METHOD.DELETE;
export const isPatch = (method?: string) => method === METHOD.PATCH;

export const setAppJsonHeaders = (res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json");
};

export const setCacheHeader = (res: ServerResponse, expDate: string, maxAge: number = MAX_AGE) => {
  res.setHeader("Cache-Control", `public, max-age=${maxAge}`);
  res.setHeader("Expires", expDate);
};

export const handleError = (
  res: ServerResponse,
  statusCode?: number,
  errorMessage?: string
): void => {
  if (statusCode === 409) {
    console.log(errorMessage);
    setAppJsonHeaders(res);
    res.statusCode = 409;
    res.end(JSON.stringify({ error: errorMessage }));
  } else if (statusCode === 400) {
    console.log(errorMessage);
    setAppJsonHeaders(res);
    res.statusCode = 400;
    res.end(JSON.stringify({ error: errorMessage }));
  } else if (statusCode === 404) {
    console.log(errorMessage);
    setAppJsonHeaders(res);
    res.statusCode = 404;
    res.end(JSON.stringify({ error: errorMessage }));
  } else {
    setAppJsonHeaders(res);
    res.end(JSON.stringify({ error: "Something went wrong" }));
  }
};

export const getPaths = (reqUrl?: string): { pathname: string; userId: string } => {
  const emptyReturnValues = {
    pathname: "",
    userId: "",
  };
  if (!reqUrl) {
    return emptyReturnValues;
  }

  const pathname = url.parse(reqUrl, true).pathname;

  if (!pathname) {
    return emptyReturnValues;
  }

  const [_, __, userId] = pathname.split("/");

  return { pathname, userId: userId ?? "" };
};

export const getRouteKey = (pathname: string, userId: string) =>
  Object.keys(restHandlers).find((key) => {
    const pattern = key.replace(":id", "\\d+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  }) ?? "";
