import express, { Router } from "express";
import { createServer, Server as HttpServer } from "http";
import { buildLogger } from "../config";
import cors from "cors";
import path from "path";
import { SocketService } from "../infraestructure/services/socket.service";
import { SocketEventHandler } from "../infraestructure/websocket/socket-event-handler";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly httpServer: HttpServer;

  constructor(option: Options) {
    const { port, routes } = option;

    this.port = port;
    this.routes = routes;
    this.httpServer = createServer(this.app);
  }

  async start() {

    //Middlewares
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded is postman

    //Views with ejs
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "views"));

    //Routes definition
    this.app.use(this.routes);

    //Socket
    const io = SocketService.init(this.httpServer);
    const socketEventHandler = new SocketEventHandler(io);
    socketEventHandler.registerEvents();

    this.httpServer.listen(this.port, () => {
      buildLogger("Server").log(`Server started on port ${this.port}`);
    });
  }
}
