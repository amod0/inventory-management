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

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const category = await Category.findById({ _id: id });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).json({
      id: category.id,
      name: category.name,
      description: category.description,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error, Something went wrong to edit the category details",
    });
  }
};

const deleteCategory = async (
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

    const category = await Category.findOneAndDelete({ id });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.status(200).json({
      message: "Category deleted successfully",
      _id: category._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error, Something went wrong to delete the Category!",
      error: (error as Error).message,
    });
  }
};

export { createCategory, updateCategory, deleteCategory };
