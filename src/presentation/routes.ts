import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { AdminRoutes } from "./admin/routes";

export class AppRoutes {
  static get routes(): Router {

    const router = Router();

    // Add your routes here
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/admin', AdminRoutes.routes)

    return router;
  }
}
