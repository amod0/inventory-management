import express from "express";
import { logStockMovement } from "../controller/logStockMovement.controller";
import { secure } from "../middleware/userAuth.middleware";

const router = express.Router();

router.route("/stock-movement").post(secure, logStockMovement);

export default router;
