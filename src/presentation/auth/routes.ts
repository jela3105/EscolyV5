import { Router } from "express";
import { AuthController } from "./controller";
import {
  AuthMysqlDatasourceImpl,
  AuthRepositoryImpl,
} from "../../infraestructure";
import { BcryptAdapter } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { TokenRepository } from "../../domain/repositories/token.repository";
import { TokenService } from "../../domain/services/token/token.service";

export class AuthRoutes {

  private static router: Router;
  private static authController: AuthController;

  static initialize(tokenRepository: TokenRepository) {

    if (!AuthRoutes.authController) {
      const database = new AuthMysqlDatasourceImpl(
        BcryptAdapter.hash,
        BcryptAdapter.compare
      );
      const authRepository = new AuthRepositoryImpl(database);
      const tokenService = new TokenService(tokenRepository);

      AuthRoutes.authController = new AuthController(authRepository, tokenService);
    }

    const router = Router();

    // Add routes here
    router.post("/login", AuthRoutes.authController.loginUser);
    router.post("/register", AuthRoutes.authController.registerUser);
    router.get("/create-password/:token", [AuthMiddleware.validateURLJWT], AuthRoutes.authController.createPasswordForm)
    router.post("/generate-password/:token", [AuthMiddleware.validateURLJWT], AuthRoutes.authController.generatePassword)

    AuthRoutes.router = router;

  }

  static get routes(): Router {

    if (!AuthRoutes.router) {
      throw new Error("AuthRoutes not initialized. Call AuthRoutes.initialize() first")
    }

    return AuthRoutes.router;
  }
}
