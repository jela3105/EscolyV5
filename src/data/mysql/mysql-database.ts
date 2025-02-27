import mysql from "mysql2/promise";
import { envs } from "../../config";

export class MysqlDatabase {

  private static poolInstance: mysql.Pool;

  private constructor() { }

  public static async getPoolInstance(): Promise<mysql.Pool> {

    if (!this.poolInstance) {
      this.poolInstance = mysql.createPool({
        host: envs.MYSQL_HOST,
        port: envs.MYSQL_DOCKER_PORT,
        password: envs.MYSQL_PASSWORD,
        user: "root",
        database: envs.MYSQL_DATABASE,
      });
    }

    return this.poolInstance;
  }
}
