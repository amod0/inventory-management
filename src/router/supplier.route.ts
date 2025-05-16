import express from "express";
import { admin, secure } from "../middleware/userAuth.middleware";
import {
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "../controller/supplier.controller";

const router = express.Router();

router.route("/create").post(secure, admin, createSupplier);
router.route("/edit/:id").put(secure, admin, updateSupplier);
router.route("/delete/:id").delete(secure, admin, deleteSupplier);

export default router;
