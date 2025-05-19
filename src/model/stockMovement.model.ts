import mongoose from "mongoose";
import { STOCKTYPE_ENUM } from "../enum/stockType.enum";
import { Product } from "./product.model";

export interface IStockMovement {
  product: mongoose.Types.ObjectId;
  type: STOCKTYPE_ENUM;
  quantity: String;
  note: String;
  createdAt: Date;
  updatedAt: Date;
}

const stockMovementSchema = new mongoose.Schema<IStockMovement>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: false,
    },
    type: {
      type: String,
      enum: Object.values(STOCKTYPE_ENUM),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
export { StockMovement };
