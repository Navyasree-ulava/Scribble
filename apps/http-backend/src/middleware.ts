import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/config/env';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    // jwt.verify throws on a missing, malformed, or expired token, so it has to
    // be wrapped. Without this an invalid token crashes the request instead of
    // returning a 401.
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded && typeof decoded !== "string" && "userId" in decoded) {
            // @ts-ignore
            req.userId = decoded.userId;
            next();
            return;
        }

        res.status(401).json({
            message: "Unauthorized"
        });
    } catch {
        res.status(401).json({
            message: "Unauthorized"
        });
    }
}