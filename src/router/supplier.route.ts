import express from "express";
import { admin, secure } from "../middleware/userAuth.middleware";
import { createSupplier } from "../controller/supplier.controller";

const router = express.Router();

router.route("/create").post(secure, admin, createSupplier);

export default router;
