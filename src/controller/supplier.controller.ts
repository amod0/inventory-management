import { Request, Response, NextFunction } from "express";
import { ISupplier, Supplier } from "../model/supplier.model";

const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      res.status(400);
      throw new Error("name, email, phone, address is Required!");
    }

    const supplierData: Partial<ISupplier> = {
      name,
      email,
      phone,
      address,
    };

    const supplier = await Supplier.create(supplierData);
    res.status(201).json({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Supplier",
      error: (error as Error).message,
    });
  }
};

export { createSupplier };
