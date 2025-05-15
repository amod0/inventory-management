import express from "express";
import { secure, admin } from "../middleware/userAuth.middleware";
import { createProduct, updateProduct } from "../controller/product.controller";
import { upload } from "../middleware/image.middleware";

const router = express.Router();

router.route("/create").post(secure, upload.single("image"), createProduct);
router
  .route("/edit/:sku")
  .put(secure, admin, upload.single("image"), updateProduct);

export default router;
