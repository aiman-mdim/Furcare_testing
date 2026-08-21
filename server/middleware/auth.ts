import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token =
    req.cookies?.furcare_token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    const payload = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    };

    req.userId = payload.userId;
    req.userRole = payload.role;

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired authentication token",
    });
  }
}
