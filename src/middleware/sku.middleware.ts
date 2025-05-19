import {
  CallbackWithoutResultAndOptionalError,
  Model,
  Schema,
  Document,
} from "mongoose";
import slugify from "slugify";
import { Product } from "../model/product.model";

export interface ISkuDocument extends Document {
  name: string;
  sku: string;
}

export async function generateSku<SKU extends ISkuDocument>(
  model: Model<SKU>,
  name: string,
  existingSku?: string
): Promise<string> {
  if (!name || typeof name !== "string") {
    throw new Error("Name of the product should be String");
  }

  let sku = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (existingSku === sku) {
    return sku;
  }

  try {
    let existingDoc = await Product.findOne({ sku });
    let counter = 1;
    const baseSku = sku;
    sku = `${Math.round(Math.random() * 100)}-${baseSku}-${Math.round(
      Math.random() * 100
    )}`;
    existingDoc = await Product.findOne({ sku });
    return sku;
  } catch (error) {
    throw new Error(`Failed to generate SKU: ${(error as Error).message}`);
  }
}

export function attachedMiddleware<I extends ISkuDocument>(
  schema: Schema<I>,
  field: string = "name"
): void {
  schema.pre<I>(
    "save",
    async function (next: CallbackWithoutResultAndOptionalError) {
      const fieldValue = (this as any)[field] as string;
      if (!fieldValue) {
        return next(new Error(`${field} is required for slug generation`));
      }

      if (this.isNew || this.isModified(field)) {
        this.sku = await generateSku<I>(
          this.constructor as Model<I>,
          fieldValue,
          this.sku
        );
      }
      next();
    }
  );
}
