import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { AdminRoutes } from "./admin/routes";
import { InMemoryTokenRepository } from "../infraestructure/persistence/memory.token.repository.impl";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { SupportRoutes } from "./support/routes";
import { GuardianRoutes } from "./guardian/routes";

export class AppRoutes {
  static get routes(): Router {

    const router = Router();

    const tokenRepository = new InMemoryTokenRepository();
    AuthRoutes.initialize(tokenRepository)
    //TODO: Remove token repository from adminroutes
    AdminRoutes.initialize(tokenRepository)
    SupportRoutes.initialize();
    GuardianRoutes.initialize();

    // Add your routes here
    router.use('/auth', AuthRoutes.routes);
    router.use('/admin', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.routes)
    router.use('/guardian', [AuthMiddleware.validateJWT, AuthMiddleware.isGuardian], GuardianRoutes.routes)
    router.use('/support', [AuthMiddleware.validateJWT], SupportRoutes.routes)

    return router;
  }
}
