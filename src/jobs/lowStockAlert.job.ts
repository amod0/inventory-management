import cron from "node-cron";
import { lowStockAlert } from "../controller/product.controller";

cron.schedule("0 0 * * *", () => {
  console.log("Starting low stock cron job...");
  lowStockAlert();
});
