import { Request, Response, NextFunction } from "express";
import { ROLE_ENUM } from "../enum/role.enum";
import { User } from "../model/user.model";
import JWT from "jsonwebtoken";

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: String;
      email: String;
      password: String;
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

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,

      //  verifyToken:
    });
  } catch (error) {
    res.status(500);
    console.log(error);
    next(new Error("Service Error, Server problem registring the User."));
  }
};

const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req?.body);
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
        isAdmin: user.isAdmin,
        accessToken,
      });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Service Error, problem while logging in" });
  }
};

const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("JWT");
  res.status(200).json({ message: "logged out successfully" });
};

export { userRegister, userLogin, userLogout };
