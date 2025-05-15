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

const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, phone, address } = req.body;
    const { id } = req.params;

    const supplier = await Supplier.findById({ _id: id });
    if (!supplier) {
      res.status(404);
      throw new Error("Suppliers not found");
    }
    if (email) supplier.email = email;
    if (phone) supplier.phone = phone;
    if (address) supplier.address = address;

    await supplier.save();

    res.status(200).json({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error, Something went wrong to edit the Supplier details",
      error: (error as Error).message,
    });
  }
};

export { createSupplier, updateSupplier };
