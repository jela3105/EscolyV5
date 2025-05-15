import { NextFunction, Request, RequestHandler, Response } from "express";
import { buildLogger, JwtAdapter } from "../../config";
import { MysqlDatabase } from "../../data/mysql";

export class AuthMiddleware {

  private static logger = buildLogger("AuthMiddleware");

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
      const payload = await JwtAdapter.validateToken<{ id: string, role: number }>(token);

      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      //TODO: Change query to use repository 
      await (await MysqlDatabase.getPoolInstance())
        .query("SELECT * FROM User WHERE userId = ?", [payload.id])
        .then((result: any) => {
          req.body.user = result[0][0];
        });

      req.body.payload = payload;
      next();
    } catch (error) {
      this.logger.error(`${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static isGuardian: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { role } = req.body.payload;
    try {

      if (role !== 1) {
        res.status(401).json({ error: "Unauthorized user for operation" });
        return;
      }

      next();
    } catch (error) {
      this.logger.error(`${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static isAdmin: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { role } = req.body.payload;
    try {

      if (role !== 3) {
        res.status(401).json({ error: "Unauthorized user for operation" });
        return;
      }

      next();
    } catch (error) {
      this.logger.error(`${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static validateURLJWT: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { token } = req.params;
    try {

      const payload = await JwtAdapter.validateToken<{ email: string }>(token);

      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      req.body.payload = payload;

      next();
    } catch (error) {
      this.logger.error(`${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

}
