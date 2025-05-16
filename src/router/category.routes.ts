import express from "express";
import { admin, secure } from "../middleware/userAuth.middleware";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller";

const router = express.Router();

router.route("/create").post(secure, admin, createCategory);
router.route("/edit/:id").post(secure, admin, updateCategory);
router.route("/delete/:id").delete(secure, admin, deleteCategory);

export default router;
