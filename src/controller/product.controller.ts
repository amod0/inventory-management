import { Request, Response, NextFunction } from "express";
import { IProduct, Product } from "../model/product.model";
import { generateSku } from "../middleware/sku.middleware";
import { Supplier } from "../model/supplier.model";
import mongoose from "mongoose";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      stock,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      category,
      sku: customSku,
      supplier,
    } = req.body;

    const file = req.file;

    if (
      !name ||
      !stock ||
      !costPrice ||
      !sellingPrice ||
      !lowStockThreshold ||
      !category ||
      !supplier
    ) {
      res.status(400);
      throw new Error("Required field should be provided!");
    }

    if (!mongoose.isValidObjectId(supplier)) {
      res.status(400);
      throw new Error("Invalid supplier ID format.");
    }

    const supplierExists = await Supplier.findById(supplier);
    if (!supplierExists) {
      res.status(400);
      throw new Error("Supplier does not exist in the database.");
    }

    const image = `${req.protocol}://${req.get("host")}/uploads/${
      file?.filename
    }`;

    const productData: Partial<IProduct> = {
      name,
      stock,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      image,
      category,
      //@ts-ignore
      supplier: supplierExists.id,
    };

    if (customSku) {
      productData.sku = await generateSku(Product, customSku);
    }

    const product = await Product.create(productData);

    res.status(201).json({
      id: product.id,
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      image: product.image,
      category: product.category,
      supplier: supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: (error as Error).message,
    });
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stock, costPrice, sellingPrice, lowStockThreshold } = req.body;

    const { sku } = req.params;

    const file = req.file;

    const product = await Product.findOne({ sku });
    if (!product) {
      res.status(404);
      throw new Error("Product not Found!");
    }

    if (stock) product.stock = stock;
    if (costPrice) product.costPrice = costPrice;
    if (sellingPrice) product.sellingPrice = sellingPrice;
    if (lowStockThreshold) product.lowStockThreshold = lowStockThreshold;
    if (file) {
      product.image = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;
    }

    await product.save();

    res.status(201).json({
      id: product.id,
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      image: product.image,
      category: product.category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Something went wrong to edit the product list",
      error: (error as Error).message,
    });
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("Product Id is required");
    }

    const product = await Product.findOneAndDelete({ id });
    if (!product) {
      res.status(404);
      throw new Error("product not found");
    }

    res.status(200).json({
      message: "product deleted successfully",
      _id: product._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error, Something went wrong to delete the product!",
      error: (error as Error).message,
    });
  }
};

export { createProduct, updateProduct, deleteProduct };
