import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "../types/customRequest";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Verify JWT and attach user info to req.user
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: Role };

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Role-based authorization
export const authorize =
  (roles: Role[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
