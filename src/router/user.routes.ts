import express, { Router } from "express";
import {
  updateUser,
  userLogin,
  userLogout,
  userRegister,
} from "../controller/user.controller";
import { secure } from "../middleware/userAuth.middleware";

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/edit/:id").put(secure, updateUser);
export default router;
