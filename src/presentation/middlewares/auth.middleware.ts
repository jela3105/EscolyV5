import { NextFunction, Request, RequestHandler, Response } from "express";
import { JwtAdapter } from "../../config";
import { MysqlDatabase } from "../../data/mysql";

export class AuthMiddleware {
  static validateJWT: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header("Authorization");

    if (!authorization) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    if (!authorization.startsWith("Bearer ")) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    const token = (await authorization.split(" ")[1]) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      //TODO: Change to repository

      (await MysqlDatabase.getPoolInstance())
        .query("SELECT * FROM User WHERE userId = ?", [payload.id])
        .then((result) => {
          req.body.user = result[0];
        });

      req.body.payload = payload;

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
