import { Request, Response } from "express";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { AuthRepository, CustomError, RegisterUser } from "../../domain";
import { JwtAdapter } from "../../config";

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
    
    new RegisterUser(this.authRepository, JwtAdapter.generateToken)
      .execute(registeruserDTO!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res))

  };

  loginUser = async (req: Request, res: Response) => {
    res.json("loginrUser conroller");
  };

  getUsers = (req: Request, res: Response) => {
    this.authRepository
      .getUsers()
      .then((users) => {
        res.json({
          users,
          payload: req.body.payload,
          user: req.body.user,
        });
      })
      .catch((error) => this.handleError(error, res));
  };
}
