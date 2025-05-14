import mongoose from "mongoose";

export interface ICategory {
  name: String;
  description: String;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
export { Category };
