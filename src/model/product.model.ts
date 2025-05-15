import mongoose from "mongoose";
import { attachedMiddleware, ISkuDocument } from "../middleware/sku.middleware";

export interface IProduct extends ISkuDocument {
  name: string;
  category: string; // reff category
  supplier: mongoose.Types.ObjectId;
  stock: Number;
  costPrice: Number;
  sellingPrice: Number;
  lowStockThreshold: string;
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
    type: String,
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
