import express from "express";
import { secure } from "../middleware/userAuth.middleware";
import { createProduct } from "../controller/product.controller";
import { upload } from "../middleware/image.middleware";

const router = express.Router();

router.route("/create").post(secure, upload.single("image"), createProduct);

export default router;
