import { Request, Response, NextFunction } from "express";

const stockManage = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "error listing the stock movement!",
      error: (error as Error).message,
    });
  }
};

export { stockManage };
