import rateLimit from "express-rate-limit";
import { config } from "../config";
import { DEFAULT_SERVER_BUSSY } from "./message.handler";

export const limiter = rateLimit({
    windowMs: 1 * 1000,
    max: config.limitRequestPerSecond,
    standardHeaders: false,
    legacyHeaders: false,
    message: DEFAULT_SERVER_BUSSY,
});

export const limiterGetRefreshToken = rateLimit({
    windowMs: config.jwtRefreshLifeTime * 1000,
    max: 3,
    standardHeaders: false,
    legacyHeaders: false,
    message: DEFAULT_SERVER_BUSSY,
});

export const limiterGetAnonymousToken = rateLimit({
    windowMs: config.jwtLifeTime * 1000,
    max: 1,
    standardHeaders: false,
    legacyHeaders: false,
    message: DEFAULT_SERVER_BUSSY,
});
