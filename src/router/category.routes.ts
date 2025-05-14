import express from "express";
import { admin, secure } from "../middleware/userAuth.middleware";
import { createCategory } from "../controller/category.controller";

const router = express.Router();

router.route("/create").post(secure, admin, createCategory);

export default router;
