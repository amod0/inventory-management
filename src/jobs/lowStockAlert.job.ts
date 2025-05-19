// import cron from "node-cron";
// import { Product } from "../model/product.model";
// import { sendLowStockEmail } from "../utils/email.util";

// // Cron job to check low stock products
// const checkLowStock = async () => {
//   try {
//     console.log("Running low stock check...");
//     // Find all products where stock is less than lowStockThreshold
//     const products = await Product.find({
//       $expr: { $lt: ["$stock", "$lowStockThreshold"] },
//     }).populate("supplier");

//     if (!products.length) {
//       console.log("No products with low stock found.");
//       return;
//     }

//     // Process each product
//     for (const product of products) {
//       if (!product || !product.supplier) {
//         console.log(`Product or supplier not found for product ${product._id}`);
//         continue;
//       }

//       // @ts-ignore
//       const supplierEmail = product.supplier.email;
//       const productId = (
//         product._id as string | number | { toString(): string }
//       ).toString();
//       const stock = product.stock;

//       // Send email
//       const emailSent = await Promise.all([
//         sendLowStockEmail(supplierEmail, stock, productId),
//       ]);

//       if (emailSent[0]) {
//         console.log(`Email sent for product ${productId}`);
//         // Optionally update product to mark email sent or log the action
//       } else {
//         console.error(`Failed to send email for product ${productId}`);
//       }
//     }
//   } catch (error) {
//     console.error("Error in low stock cron job:", error);
//   }
// };

// // Schedule cron job to run daily at midnight
// cron.schedule("0 0 * * *", () => {
//   console.log("Starting low stock cron job...");
//   checkLowStock();
// });

// // Optional: Export the function for testing or manual triggering
// export { checkLowStock };

import cron from "node-cron";
import { lowStockAlert } from "../controller/product.controller";

// // Schedule cron job to run daily at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Starting low stock cron job...");
  // Provide mock req, res, and next for the controller function
  const mockReq = {} as any;
  const mockRes = {} as any;
  const mockNext = () => {};
  lowStockAlert(mockReq, mockRes, mockNext);
});
