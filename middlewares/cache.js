import { StatusCodes } from "http-status-codes";
import { sendHttpResponse } from "../utils/HttpResponse.js";
import { addToCache, nodeCache } from "../utils/cache_functions.js";

export let cache = (req, res, next) => {
  try {
    res.cache = nodeCache;
    if (req.method !== "GET") return next();
    const key = req.originalUrl;
    const cachedResponse = nodeCache.get(key);

    if (cachedResponse) {
      return sendHttpResponse(res, StatusCodes.OK, cachedResponse.data);
    } else {
      const originalSend = res.send;

      res.send = function (body) {
        originalSend.call(this, body);
        if (res.statusCode === StatusCodes.OK) {
          addToCache(key, body);
        }
      };

      next();
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
  }
};
