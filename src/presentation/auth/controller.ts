import { Request, Response } from "express";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { AuthRepository } from "../../domain";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  registerUser = async (req: Request, res: Response) => {
    console.log("registerUser controller");
    const [error, registeruserDTO] = RegisterUserDTO.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.authRepository
      .register(registeruserDTO!)
      .then((user) => res.json(user))
      .catch((error) => res.status(500).json(error));
  };

  loginUser = async (req: Request, res: Response) => {
    res.json("loginrUser conroller");
  };
}
