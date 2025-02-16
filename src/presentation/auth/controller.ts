import { Request, Response } from "express";

export class AuthController {
  constructor() {}

  registerUser = async (req: Request, res: Response) => {
    res.json("registerUser conroller");
  };

  loginUser = async (req: Request, res: Response) => {
    res.json("loginrUser conroller");
  };
}
