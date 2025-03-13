import { Router } from "express";
import { AuthController } from "./controller";
import {
  AuthMysqlDatasourceImpl,
  AuthRepositoryImpl,
} from "../../infraestructure";
import { BcryptAdapter } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const database = new AuthMysqlDatasourceImpl(
      BcryptAdapter.hash,
      BcryptAdapter.compare
    );

    const authRepository = new AuthRepositoryImpl(database);
    const authController = new AuthController(authRepository);

    // Add routes here
    router.post("/login", authController.loginUser);
    router.post("/register", authController.registerUser);
    router.get("/create-password/:token", authController.createPasswordForm)
    router.post("/generate-password/:token", authController.generatePassword)

    return router;
  }
}
