import mongoose from "mongoose";

export interface ISupplier {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const supplierSchema = new mongoose.Schema<ISupplier>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    maxlength: 10,
    minlength: 10,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);
export { Supplier };
