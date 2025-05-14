import { Request, Response, NextFunction } from "express";
import { Category, ICategory } from "../model/category.model";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400);
      throw new Error("Name and description of the caregory is Required!");
    }

    const categoryData: Partial<ICategory> = {
      name,
      description,
    };

    const category = await Category.create(categoryData);
    res.status(201).json({
      id: category.id,
      name: category.name,
      description: category.description,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Category",
      error: (error as Error).message,
    });
  }
};

export { createCategory };
