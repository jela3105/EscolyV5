import { Request, Response } from "express";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { AuthRepository, RegisterUser, LoginUser } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { JwtAdapter } from "../../config";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";

export class AuthController {

  constructor(private readonly authRepository: AuthRepository) { }

  registerUser = async (req: Request, res: Response) => {
    const [error, registeruserDTO] = RegisterUserDTO.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new RegisterUser(this.authRepository)
      .execute(registeruserDTO!)
      .then(data => res.json(data))
      .catch(error => HttpErrorHandler.handleError(error, res))
  };

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserDTO] = LoginUserDTO.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new LoginUser(this.authRepository, JwtAdapter.generateToken)
      .execute(loginUserDTO!)
      .then(data => res.json(data))
      .catch(error => HttpErrorHandler.handleError(error, res))
  };

}
