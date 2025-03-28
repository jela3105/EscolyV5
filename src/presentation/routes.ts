import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { AdminRoutes } from "./admin/routes";
import { InMemoryTokenRepository } from "../infraestructure/persistence/memory.token.repository.impl";
import { AuthMiddleware } from "./middlewares/auth.middleware";

export class AppRoutes {
  static get routes(): Router {

    const router = Router();

    const tokenRepository = new InMemoryTokenRepository();
    AuthRoutes.initialize(tokenRepository)
    AdminRoutes.initialize(tokenRepository)

    // Add your routes here
    router.use('/auth', AuthRoutes.routes);
    router.use('/admin', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], AdminRoutes.routes)

    return router;
  }
}
