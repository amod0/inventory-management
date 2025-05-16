import express, { Router } from "express";
import {
  deleteAdmin,
  deleteStaff,
  updateUser,
  updateAdmin,
  userLogin,
  userLogout,
  userRegister,
} from "../controller/user.controller";
import { admin, secure } from "../middleware/userAuth.middleware";

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/edit/:id").put(secure, updateUser);
router.route("/editrole/:id").put(secure, admin, updateAdmin);
router.route("/delete/me").delete(secure, deleteStaff);
router.route("/delete/:id").delete(secure, admin, deleteAdmin);

export default router;
