import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { AdminRoutes } from "./admin/routes";
import { InMemoryTokenRepository } from "../infraestructure/persistence/memory.token.repository.impl";

export class AppRoutes {
  static get routes(): Router {

    const router = Router();

    const tokenRepository = new InMemoryTokenRepository();
    AuthRoutes.initialize(tokenRepository)
    AdminRoutes.initialize(tokenRepository)

    // Add your routes here
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/admin', AdminRoutes.routes)

    return router;
  }
}
