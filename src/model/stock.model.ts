import mongoose from "mongoose";
import { STOCK_ENUM } from "../enum/stock.enum";
import { Product } from "./product.model";

export interface IStock {
  stock: STOCK_ENUM;
  product: String;
}

const stockSchema = new mongoose.Schema<IStock>(
  {
    stock: {
      type: String,
      enum: Object.values(STOCK_ENUM),
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", stockSchema);
export { Stock };
