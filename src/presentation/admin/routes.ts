import { Router } from "express";
import { AdminDatasourceImpl } from "../../infraestructure/datasources/admin.mysql.datasource.implementation";
import { AdminRepositoryImpl } from "../../infraestructure";
import { AdminController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { NodeMailerService } from "../../infraestructure/services/nodemailes.service";
import { envs } from "../../config";
import { TokenRepository } from "../../domain/repositories/token.repository";

export class AdminRoutes {

  private static router: Router;
  private static adminController: AdminController;

  static initialize(tokenRepository: TokenRepository) {

    if (!AdminRoutes.adminController) {
      const database = new AdminDatasourceImpl();

      const emailService = new NodeMailerService();

      const url = envs.WEB_SERVICE_URL;
      const adminRepository = new AdminRepositoryImpl(database);

      AdminRoutes.adminController = new AdminController({
        adminRepository,
        emailService,
        url,
        tokenRepository
      });
    }

    const router = Router();
    // Add routes here
    router.get("/teachers", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.adminController.getTeachers);
    router.post("/teachers/register", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.adminController.registerTeacher);
    router.post("/guardian/register", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.adminController.registerGuardian);
    router.post("/register", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.adminController.registerAdmin);
    router.get("/groups", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.adminController.getGroups);
    router.post("/groups/register", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.adminController.registerGroup);

    AdminRoutes.router = router;
  }

  static get routes(): Router {
    if (!AdminRoutes.router) {
      throw new Error("AdminRoutes not initialized. Call AuthRoutes.initialize() first")
    }

    return AdminRoutes.router;
  }
}
