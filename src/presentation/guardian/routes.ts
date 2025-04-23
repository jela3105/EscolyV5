import { Router } from "express";
import { GuardianController } from "./controllers";
import { GuardianDataSourceImpl } from "../../infraestructure/datasources/guardian.mysql.datasource.impl";
import { GuardianRepositoryImpl } from "../../infraestructure/repositories/guardian.repository.impl";

export class GuardianRoutes {

    private static router: Router;
    private static guardianController: GuardianController;

    static initialize() {

        if (!GuardianRoutes.guardianController) {

            const database = new GuardianDataSourceImpl();
            const guardianRepository = new GuardianRepositoryImpl(database);

            const guardianController = new GuardianController(guardianRepository);
            GuardianRoutes.guardianController = guardianController;
        }

        const router = Router();

        router.get("/students", GuardianRoutes.guardianController.getStudents);

        GuardianRoutes.router = router;
    }

    static get routes(): Router {

        if (!GuardianRoutes.router) {
            throw new Error("SupportRoutes not initialized. Call SupportRoutes.initialize() first");
        }

        return GuardianRoutes.router;
    }
}