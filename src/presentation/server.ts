import express, { Router } from "express";
import { buildLogger } from "../config";
import cors from "cors";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(option: Options) {
    const { port, routes } = option;

    this.port = port;
    this.routes = routes;
  }

  async start() {

    //Middlewares
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded is postman

    //Routes definition
    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      buildLogger("Server").log(`Server started on port ${this.port}`);
    });
  }
}
