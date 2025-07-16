import { StatusCodes } from "http-status-codes";
import rateLimit from "express-rate-limit";
import { logMaliciousUser } from "../../utils/helper.js";

export const limitAuth = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    keyGenerator: (req) => req.headers["x-forwarded-for"] || req.ip,
    handler: async (req, res) => {
        logMaliciousUser(req, "login");
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
            success: false,
            data: {
                message: "Too many requests, please try again later.",
                error_number: null,
            },
        });
    },
});

export const publicLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    keyGenerator: (req) => req.headers["x-forwarded-for"] || req.ip,
    message: {
        success: false,
        msg: "Too many requests from this IP, please try again after 1 minutes :) ",
    },
    handler: async (req, res) => {
        logMaliciousUser(req, "limit");
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
            success: false,
            data: {
                message: "Too many requests, please try again later.",
                error_number: null,
            },
        });
    },
});
