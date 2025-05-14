import express, { Router } from "express";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controller/user.controller";

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
export default router;
