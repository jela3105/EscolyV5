import { Router } from "express";
import { SupportController } from "./controllers";
import { NodeMailerService } from "../../infraestructure/services/nodemailes.service";
import { SupportDataSourceImpl } from "../../infraestructure/datasources/support.mysql.datasource.impl";
import { SupportRepositoryImpl } from "../../infraestructure/repositories/support.repository.impl";

export class SupportRoutes {

    private static router: Router;
    private static supportController: SupportController;

    static initialize() {

        if (!SupportRoutes.supportController) {

            const database = new SupportDataSourceImpl();
            const supportRepository = new SupportRepositoryImpl(database);
            const emailService = new NodeMailerService();

            const supportController = new SupportController(emailService, supportRepository);
            SupportRoutes.supportController = supportController;
        }

        const router = Router();

        router.get("/", SupportRoutes.supportController.getAllTicketsByUserId);
        router.get("/severity", SupportRoutes.supportController.getSeverity);
        router.post("/ticket", SupportRoutes.supportController.createTicket);

        SupportRoutes.router = router;
    }

    static get routes(): Router {

        if (!SupportRoutes.router) {
            throw new Error("SupportRoutes not initialized. Call SupportRoutes.initialize() first");
        }

        return SupportRoutes.router;
    }
}