import { Request, Response } from "express";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { AuthRepository, RegisterUser, LoginUser } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { envs, JwtAdapter } from "../../config";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { TokenService } from "../../domain/services/token/token.service";

export class AuthController {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService
  ) { }

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

  createPasswordForm = async (req: Request, res: Response) => {
    const { token } = req.params;

    if (!token) res.status(404).json()

    const isTokenInvalidated = await this.tokenService.isTokenInvalidated(token);

    if (isTokenInvalidated) {
      res.status(401).json("Invalid token")
      return;
    }

    res.render("create-password", { baseUrl: envs.WEB_SERVICE_URL, token: token })
  }

  generatePassword = async (req: Request, res: Response) => {
    const { payload } = req.body;
    const { token } = req.params;

    if (!token) res.status(404).json()

    await this.tokenService.invalidateToken(token, payload.exp);
    res.render("close-window");
  }

}
