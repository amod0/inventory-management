import { Request, Response, NextFunction } from "express";
import { IProduct, Product } from "../model/product.model";
import { Supplier } from "../model/supplier.model";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      sku,
      stock,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      category,
    } = req.body;

    const file = req.file;

    if (
      !name ||
      !sku ||
      !stock ||
      !costPrice ||
      !sellingPrice ||
      !lowStockThreshold ||
      !category
    ) {
      res.status(400);
      throw new Error("Required field should be provided!");
    }

    const image = `${req.protocol}://${req.get("host")}/uploads/${
      file?.filename
    }`;

    const ProductData: Partial<IProduct> = {
      name,
      sku,
      stock,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      image,
      category,
      //@ts-ignore
      // supplier: req.supplier.id,
    };

    //@ts-ignore
    const supplier = req.supplier;

    const product = await Product.create(ProductData);

    res.status(200).json({
      id: product.id,
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      image: product.image,
      category: product.category,
      // supplier: supplier.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: (error as Error).message,
    });
  }
};

export { createProduct };
