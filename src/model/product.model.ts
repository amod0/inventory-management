import mongoose, { Schema } from "mongoose";
import { attachedMiddleware, ISkuDocument } from "../middleware/sku.middleware";

export interface IProduct extends ISkuDocument {
  _id: Schema.Types.String;
  name: string;
  category: string; // reff category
  supplier: mongoose.Types.ObjectId;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold: number;
  image: string;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },

  sku: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
  },

  category: {
    type: String,
    required: true,
  },

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },

  costPrice: {
    type: Number,
    required: true,
  },

  sellingPrice: {
    type: Number,
    required: true,
  },

  lowStockThreshold: {
    type: Number,
    required: false,
  },

  image: {
    type: String,
    required: false,
  },
});

attachedMiddleware<IProduct>(productSchema);

const Product = mongoose.model("Product", productSchema);
export { Product };
