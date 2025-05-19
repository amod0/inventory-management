import { Request, Response, NextFunction } from "express";
import { IProduct, Product } from "../model/product.model";
import { generateSku } from "../middleware/sku.middleware";
import { Supplier } from "../model/supplier.model";
import mongoose from "mongoose";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import { sendLowStockEmail } from "../utils/email.util";
import { promises } from "dns";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      sku: customSku,
      stock,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      category,
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
    const { sku } = req.params;
    if (!sku) {
      res.status(400);
      throw new Error("Product Id is required");
    }

    const product = await Product.findOneAndDelete({ sku });
    if (!product) {
      res.status(404);
      throw new Error("product not found");
    }

    res.status(200).json({
      message: "product deleted successfully",
      _id: product._id,
      sku: product.sku,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error, Something went wrong to delete the product!",
      error: (error as Error).message,
    });
  }
};

const exportCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.find();

    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, "../../report/file.csv"),
      header: [
        { id: "name", title: "Name" },
        { id: "category", title: "Category" },
        { id: "supplier", title: "Supplier" },
        { id: "stock", title: "Stock" },
        { id: "costPrice", title: "Cost Price" },
        { id: "sellingPrice", title: "Selling Price" },
        { id: "lowStockThreshold", title: "Low Stock Threshold" },
        { id: "image", title: "image" },
      ],
    });

    await csvWriter.writeRecords(product);
    res.sendFile(path.join(__dirname, "../../report/file.csv"));
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to export as CSV ",
      error: (error as Error).message,
    });
  }
};

const lowStockAlert = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find({
      $expr: { $lt: ["$stock", "$lowStockThreshold"] },
    }).populate<{ supplier: { email: string } }>("supplier");

    if (!products.length) {
      res.status(200).json({
        message: "No products with low stock found.",
      });
    }

    for (const product of products) {
      if (!product || !product.supplier) {
        res.status(200).json({
          message: `Product or Supplier not found for product ${product.id}`,
        });
        continue;
      }

      const supplierEmail = product.supplier.email;
      const productId = (
        product.id as string | number | { toString(): string }
      ).toString();
      const stock = product.stock;

      const emailSent = await Promise.all([
        sendLowStockEmail(supplierEmail, stock, productId),
      ]);

      if (emailSent[0]) {
        console.log(`Email sent for product ${productId}`);
        res.status(200).json({
          message: `Email sent for product ${product.id}`,
        });
      } else {
        console.error(`Failed to send email for product ${productId}`);
        res.status(400).json({
          message: `Failed to send email for Product ${productId}`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to Warn about Low Product Stocks",
      error: (error as Error).message,
    });
  }
};

export {
  createProduct,
  updateProduct,
  deleteProduct,
  exportCSV,
  lowStockAlert,
};
