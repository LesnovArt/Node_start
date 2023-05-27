import http from "http";

import * as serverUtils from "./helpers/server-utils";

import { restHandlers } from "./rest/users";
import { HOST, PORT } from "./constants";

const server = http.createServer((req, res) => {
  const { pathname, userId } = serverUtils.getPaths(req.url);
  const routerKey = serverUtils.getRouteKey(pathname, userId);

  const restHandler = restHandlers[routerKey];

  if (restHandler) {
    restHandler(req, res, userId);
    return;
  } else {
    serverUtils.handleError(res);
    return;
  }
});

server.listen(PORT, HOST, () => {
  console.log(`server started on: http://${HOST}:${PORT}`);
});
