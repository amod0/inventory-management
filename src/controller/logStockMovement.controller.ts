import { Request, Response, NextFunction } from "express";
import { STOCKTYPE_ENUM } from "../enum/stockType.enum";
import mongoose from "mongoose";
import { Product } from "../model/product.model";
import { StockMovement } from "../model/stockMovement.model";

const logStockMovement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, productId, quantity, note } = req.body as {
      type: STOCKTYPE_ENUM;
      productId: mongoose.Types.ObjectId;
      quantity: number;
      note: string;
    };
    if (!type || !productId || !quantity || !note) {
      res.status(400);
      throw new Error("please provide the details of transaction");
    }

    if (!mongoose.isValidObjectId(productId)) {
      res.status(400);
      console.log("Invalid product ID:", productId);
      throw new Error("Invalid product ID.");
    }

    if (!["in", "out"].includes(type)) {
      res.status(400).json({ error: "Type must be IN or OUT" });
    }
    if (quantity <= 0) {
      res.status(400).json({ error: "Quantity must be positive" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(400);
      throw new Error("Product does not exist in the Database!");
    }

    if (type === "out" && product.stock.valueOf() < quantity) {
      res.status(400).json({
        error: "Insufficient stock",
      });
    }

    const currentStock =
      typeof product.stock === "number" ? product.stock : Number(product.stock);

    product.stock =
      type === "in" ? currentStock + quantity : currentStock - quantity;
    await product.save();

    const movement = new StockMovement({
      product: productId,
      type,
      quantity,
      note,
      date: new Date(),
    });
    await movement.save();

    res.status(201).json({
      message: "Stock movement logged",
      movement,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "error listing the stock movement!",
      error: (error as Error).message,
    });
  }
};

export { logStockMovement };
