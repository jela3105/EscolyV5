import { Router } from "express";
import { AuthController } from "./controller";
import {
  AuthMysqlDatasourceImpl,
  AuthRepositoryImpl,
} from "../../infraestructure";
import { BcryptAdapter, envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { TokenRepository } from "../../domain/repositories/token.repository";
import { TokenService } from "../../domain/services/token/token.service";
import { NodeMailerService } from "../../infraestructure/services/nodemailes.service";
import { SocketService } from "../../infraestructure/services/socket.service";

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
      const emailService = new NodeMailerService();
      const url = envs.WEB_SERVICE_URL;

      AuthRoutes.authController = new AuthController(authRepository, tokenService, emailService, url);
    }

    const router = Router();

    // Add routes here
    router.post("/login", AuthRoutes.authController.loginUser);
    //router.post("/register", AuthRoutes.authController.registerUser);
    router.get("/create-password/:token", [AuthMiddleware.validateURLJWT], AuthRoutes.authController.createPasswordForm)
    router.post("/generate-password/:token", [AuthMiddleware.validateURLJWT], AuthRoutes.authController.generatePassword)
    router.get("/password", AuthRoutes.authController.forgetPassword);
    router.get("/change-password/:token", [AuthMiddleware.validateURLJWT], AuthRoutes.authController.recoverPasswordForm);
    router.post("/recover-password/:token", [AuthMiddleware.validateURLJWT], AuthRoutes.authController.recoverPassword);
    router.put("/change-password", [AuthMiddleware.validateJWT], AuthRoutes.authController.changePassword);

    router.post("/location", (req, res) => {
      const { deviceId, latitude, longitude } = req.body;

      if (!deviceId || !latitude || !longitude) {
        res.status(400).json({ error: "need paramethers" });
        return;
      }

      console.log("Ubicación recibida:", { deviceId, latitude, longitude });

      try {
        const io = SocketService.getIO();
        io.to(deviceId).emit("location-update", {
          lat: latitude,
          lng: longitude,
        });

        res.status(200).json({ message: "Ubicación enviada por socket" });
      } catch (err) {
        console.error("Error al emitir ubicación:", err);
        res.status(500).json({ error: "Socket not initialized" });
      }
    });

    AuthRoutes.router = router;

  }

  static get routes(): Router {

    if (!AuthRoutes.router) {
      throw new Error("AuthRoutes not initialized. Call AuthRoutes.initialize() first")
    }

    return AuthRoutes.router;
  }
}
