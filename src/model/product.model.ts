import mongoose from "mongoose";

export interface IProduct {
  name: string;
  sku: string;
  category: string; // reff category
  supplier: mongoose.Schema.Types.ObjectId;
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
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  supplier: {
    type: String,
    ref: "Supplier",
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

const Product = mongoose.model("Product", productSchema);
export { Product };
