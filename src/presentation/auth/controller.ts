import { Request, Response } from "express";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { AuthRepository, RegisterUser, LoginUser } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { JwtAdapter, Validators } from "../../config";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { TokenService } from "../../domain/services/token/token.service";
import { CreateUserPassword } from "../../domain/use-cases/auth/create-user-password.user-case";
import { ForgetPasswordEmail } from "../../domain/use-cases/auth/forget-password-email.user-case";
import { EmailService } from "../../domain/services/email/email.service";
import { RecoverUserPassword } from "../../domain/use-cases/auth/recover-user-password.user-case";

export class AuthController {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly url: string
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

    res.render("create-password", { baseUrl: this.url, token: token })
  }

  generatePassword = async (req: Request, res: Response) => {
    const { payload } = req.body;
    const { token } = req.params;

    if (!token) res.status(404).json()

    await this.tokenService.invalidateToken(token, payload.exp);

    await new CreateUserPassword(this.authRepository)
      .execute(payload.email, req.body.password)
      .catch(error => HttpErrorHandler.handleError(error, res))

    res.render("close-window");
  }

  forgetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!Validators.email.test(email)) res.status(400).json("Invalid Email");

    await new ForgetPasswordEmail(this.emailService, this.url)
      .execute(email)
      .then(() => res.status(200).json("Send email correcly"))
      .catch(error => HttpErrorHandler.handleError(error, res))
  }

  recoverPasswordForm = async (req: Request, res: Response) => {
    const { token } = req.params;

    if (!token) res.status(404).json()

    const isTokenInvalidated = await this.tokenService.isTokenInvalidated(token);

    if (isTokenInvalidated) {
      res.status(401).json("Invalid token")
      return;
    }

    res.render("recover-password", { baseUrl: this.url, token: token })
  }

  recoverPassword = async (req: Request, res: Response) => {
    const { payload } = req.body;
    const { token } = req.params;

    if (!token) res.status(404).json()

    await this.tokenService.invalidateToken(token, payload.exp);

    await new RecoverUserPassword(this.authRepository)
      .execute(payload.email, req.body.password)
      .catch(error => HttpErrorHandler.handleError(error, res))

    res.render("close-window");
  }
}