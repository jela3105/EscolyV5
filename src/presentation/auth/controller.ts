import { Request, Response } from "express";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { AuthRepository, CustomError } from "../../domain";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    } 

    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  };

  registerUser = async (req: Request, res: Response) => {
    const [error, registeruserDTO] = RegisterUserDTO.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.authRepository
      .register(registeruserDTO!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));  
  };

  loginUser = async (req: Request, res: Response) => {
    res.json("loginrUser conroller");
  };
}
