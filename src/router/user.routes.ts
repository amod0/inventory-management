import express, { Router } from "express";
import {
  deleteAdmin,
  deleteStaff,
  updateUser,
  updateAdmin,
  userLogin,
  userLogout,
  userRegister,
  sendVerificationCode,
  verifyCode,
} from "../controller/user.controller";
import { admin, secure } from "../middleware/userAuth.middleware";

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/edit/:id").put(secure, updateUser);
router.route("/editrole/:id").put(secure,  updateAdmin);
router.route("/delete/me").delete(secure, deleteStaff);
router.route("/delete/:id").delete(secure, deleteAdmin);
router.route("/send-verification-code").post(sendVerificationCode);
router.route("/verify-code").post(verifyCode);

export default router;
