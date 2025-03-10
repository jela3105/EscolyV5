import { Router } from "express";
import { AdminDatasourceImpl } from "../../infraestructure/datasources/admin.mysql.datasource.implementation";
import { AdminRepositoryImpl } from "../../infraestructure";
import { AdminController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AdminRoutes {

  static get routes(): Router {
    const router = Router();

    const database = new AdminDatasourceImpl();

    const adminRepository = new AdminRepositoryImpl(database);
    const adminController = new AdminController(adminRepository);

    // Add routes here
    router.get("/teachers", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], adminController.getTeachers);
    router.post("/teachers/register", [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], adminController.registerTeacher);

    return router;
  }
}
