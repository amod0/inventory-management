import express from "express";
import { secure, admin } from "../middleware/userAuth.middleware";
import {
  createProduct,
  deleteProduct,
  exportCSV,
  lowStockAlert,
  updateProduct,
} from "../controller/product.controller";
import { upload } from "../middleware/image.middleware";
// import {  } from "../jobs/lowStockAlert.job";

const router = express.Router();

router.route("/create").post(secure, upload.single("image"), createProduct);
router
  .route("/edit/:sku")
  .put(secure, admin, upload.single("image"), updateProduct);

router.route("/delete/:sku").delete(secure, admin, deleteProduct);
router.route("/export").get(exportCSV);
router.route("/check-low-stock").get(lowStockAlert);

export default router;
