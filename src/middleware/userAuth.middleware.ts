import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IUser, User } from "../model/user.model";
import { ROLE_ENUM } from "../enum/role.enum";

interface AuthRequest extends Request {
  user?: IUser;
  role?: ROLE_ENUM;
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
      req.role = staff.role;
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

// const admin = (...roes: string[]) => {
//   return async (req: AuthRequest, res: Response, next: NextFunction) => {
//     const isAllowed = roes.includes(req.role);
//     if (isAllowed) {
//       next();
//     } else {
//       res.status(401).json({ message: "Not authorized as Admin" });
//       return;
//     }
//     console.log("User Role:", req.user?.role);
//   };
// };


const admin = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.role) {
      res.status(401).json({ message: 'Role not found, authorization failed' });
      return;
    }

    const isAllowed = roles.includes(req.role);
    if (isAllowed) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as Admin' });
      return;
    }
  };
};

export { admin, secure };
