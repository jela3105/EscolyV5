import mysql from "mysql2";
import { envs } from "../../config";

export class MysqlDatabase {
  static async createPool() {

    const connection = mysql.createPool({
      host: envs.MYSQL_HOST,
      port: envs.MYSQL_DOCKER_PORT,
      password: envs.MYSQL_PASSWORD,
      user: "root",
      database: envs.MYSQL_DATABASE,
    });

    return connection;
  }
}
