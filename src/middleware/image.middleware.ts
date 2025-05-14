import multer, { Multer } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { Callback } from "mongoose";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.filename + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileType = /jpeg|png|jpg/;
  const extName = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileType.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image are allowed like jpeg,png,jpg"));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});
