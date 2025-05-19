import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { dbConnect } from "./src/config/dbconnect.config";
import userRouter from "./src/router/user.routes";
import supplierRouter from "./src/router/supplier.route";
import categoryRouter from "./src/router/category.routes";
import productRouter from "./src/router/product.routes";
import stockMovementRouter from "./src/router/stockMovement.route";

dbConnect();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api", stockMovementRouter);

app.listen(port, () => console.log(`Service running on Port ${port}`));
