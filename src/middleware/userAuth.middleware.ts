import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IUser, User } from "../model/user.model";

interface AuthRequest extends Request {
  user?: IUser;
}

const secure = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  token = req.headers.authorization;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      const staff = await User.findById(decoded.id).select("role");

      if (!staff) {
        res.status(401).json({ message: "User not found" });
        return;
      }
      req.user = staff;
      if (!req.user) {
        res.status(401).json({ message: "User not found" });
        return;
      }
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as Admin" });
    return;
  }
  console.log("User Role:", req.user?.role);
};
export { admin, secure };
