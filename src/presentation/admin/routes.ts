import { Router } from "express";
import { AdminDatasourceImpl } from "../../infraestructure/datasources/admin.mysql.datasource.impl";
import { AdminRepositoryImpl } from "../../infraestructure";
import { AdminController } from "./controller";
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

    router.get("/admins", AdminRoutes.adminController.getAdmins)

    router.get("/guardians", AdminRoutes.adminController.getGuardians);
    router.post("/guardian/register", AdminRoutes.adminController.registerGuardian);

    router.get("/group/:id", AdminRoutes.adminController.getGroupDescription)
    router.get("/groups", AdminRoutes.adminController.getGroups);
    router.post("/groups/register", AdminRoutes.adminController.registerGroup);

    router.post("/register", AdminRoutes.adminController.registerAdmin);

    router.post("/students/register", AdminRoutes.adminController.registerStudent);
    router.put("/student/:id", AdminRoutes.adminController.updateStudent);
    router.get("/student/:id", AdminRoutes.adminController.getStudentInfo)
    router.delete("/student/unlink-guardian", AdminRoutes.adminController.unlinkGuardiansFromStudent);

    router.get("/teachers", AdminRoutes.adminController.getTeachers);
    router.post("/teachers/register", AdminRoutes.adminController.registerTeacher);

    router.put("/users/:id", AdminRoutes.adminController.updateUser);

    AdminRoutes.router = router;
  }
  static get routes(): Router {
    if (!AdminRoutes.router) {
      throw new Error("AdminRoutes not initialized. Call AuthRoutes.initialize() first")
    }

    return AdminRoutes.router;
  }
}
