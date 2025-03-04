import { NextFunction, Request, RequestHandler, Response } from "express";
import { buildLogger, JwtAdapter } from "../../config";
import { MysqlDatabase } from "../../data/mysql";
import { UserEntityMapper } from "../../infraestructure";

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
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);

      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      //TODO: Change query to use repository 
      (await MysqlDatabase.getPoolInstance())
        .query("SELECT * FROM User WHERE userId = ?", [payload.id])
        .then((result) => {
          req.body.user = result[0];
        });

      req.body.payload = payload;
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
    const id = req.body.payload.id;
    try {
      const pool = await MysqlDatabase.getPoolInstance();
      const [rows]: [any[], any] = await pool.query("SELECT * FROM User WHERE userId = ?", [id]);

      const user = UserEntityMapper.userEntityFromObject(rows[0]);

      if (user.roleId !== 3) {
        res.status(401).json({ error: "Unauthorized user for operation" });
        return;
      }

      next();
    } catch (error) {
      this.logger.error(`${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

}
