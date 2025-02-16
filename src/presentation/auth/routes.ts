import { Router } from "express";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    // Add your routes here
    router.post("/login", (req, res) => {
      res.json("Login route");
    });

    router.post("/register", (req, res) => {
      res.json("Register route");
    });

    return router;
  }
}
