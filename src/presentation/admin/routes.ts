import { Router } from "express";
import { AdminDatasourceImpl } from "../../infraestructure/datasources/admin.mysql.datasource.implementation";
import { AdminRepositoryImpl } from "../../infraestructure";
import { AdminController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { NodeMailerService } from "../../infraestructure/services/nodemailes.service";
import { envs } from "../../config";

export class AdminRoutes {

  static get routes(): Router {
    const router = Router();

    const database = new AdminDatasourceImpl();
    //TODO: Add envs to NodeMailerService
    const emailService = new NodeMailerService();

    const adminRepository = new AdminRepositoryImpl(database);
    const adminController = new AdminController(adminRepository, emailService, envs.WEB_SERVICE_URL);

    // Add routes here
    router.get("/teachers", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], adminController.getTeachers);
    router.post("/teachers/register", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], adminController.registerTeacher);

    return router;
  }
}
