import { Request, Response, NextFunction } from "express";
import { ROLE_ENUM } from "../enum/role.enum";
import { IUser, User } from "../model/user.model";
import JWT from "jsonwebtoken";
import { Types } from "mongoose";
import {
  generateVerificationCode,
  storeVerifyToken,
  verifyToken,
} from "../utils/verification.util";
import { sendVerificationEmail } from "../utils/email.util";

interface CustomRequest extends Request {
  user?: IUser;
}

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: ROLE_ENUM;
    };
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists.");
    }
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill the form");
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be  at least 6 characters");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      const code = generateVerificationCode();
      const [emailSent] = await Promise.all([
        sendVerificationEmail(email, code),
      ]);
      const result = await verifyToken(email, code);

      if (emailSent) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          verifyToken: result.valid,
          message: "User registered and code sent",
        });
      } else {
        res.status(500);
        throw new Error("Failed to send code or store verification token");
      }
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(500);
    next(new Error("Service Error, Server problem registring the User."));
  }
};

const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await user.matchPassword(password);
    if (passwordMatch) {
      const accessToken = JWT.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
      });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Service Error, problem while logging in",
    });
  }
};

const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("JWT");
  res.status(200).json({ message: "logged out successfully" });
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(400);
      throw new Error("User not Found!");
    }

    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error, Something went wrong to edit the user details",
      error: (error as Error).message,
    });
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body as {
      role: ROLE_ENUM;
    };
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(400);
      throw new Error("User not Found!");
    }
    if (role) user.role = role;

    await user.save();
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "rror, Something went wrong to edit the user roles!",
      error: (error as Error).message,
    });
  }
};

const deleteStaff = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndDelete(req.user?._id);
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleteing the account!",
      error: (error as Error).message,
    });
  }
};

const deleteAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({
        message: "Invalid user ID",
      });
      return;
    }
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    await userToDelete.deleteOne();
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting the User",
      error: (error as Error).message,
    });
  }
};

const sendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    const code = generateVerificationCode();
    const [emailSent] = await Promise.all([
      sendVerificationEmail(email, code),
      // storeVerifyToken(email, code),
    ]);

    if (emailSent) {
      res
        .status(200)
        .json({ success: true, message: "Verification code sent" });
    } else {
      res.status(500);
      throw new Error("Failed to send verification code");
    }
  } catch (error) {
    res.status(500);
    console.error(error);
    next(new Error("Server error"));
  }
};

const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body as { email: string; code: string };
    const result = await verifyToken(email, code);
    const [tokenStored] = await Promise.all([storeVerifyToken(email, code)]);

    if (tokenStored && result) {
      res.status(200).json({
        success: result.valid,
        verifyToken: result.valid && tokenStored,
        message: result.message,
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    res.status(500);
    console.error(error);
    next(new Error("Server error"));
  }
};

export {
  userRegister,
  userLogin,
  userLogout,
  updateUser,
  updateAdmin,
  deleteStaff,
  deleteAdmin,
  sendVerificationCode,
  verifyCode,
};
