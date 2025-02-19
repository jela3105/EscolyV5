import { Router } from "express";
import { AuthController } from "./controller";
import { AuthMysqlDatasourceImpl , AuthRepositoryImpl } from "../../infraestructure";

export class AuthRoutes {
  static get routes(): Router {

    const router = Router();

    const database = new AuthMysqlDatasourceImpl();
    const authRepository = new AuthRepositoryImpl(database);
    const authController = new AuthController(authRepository);

    // Add routes here
    router.post("/login", authController.loginUser);

    router.post("/register", authController.registerUser);

    return router;
  }
}
