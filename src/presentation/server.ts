import express, { Router } from "express";
import { createServer, Server as HttpServer } from "http";
import { buildLogger } from "../config";
import cors from "cors";
import path from "path";
import { SocketService } from "../infraestructure/services/socket.service";
import { initializeSocketEventHandler, SocketEventHandler } from "../infraestructure/websocket/socket-event-handler";
import { LocationWatcherService } from "../infraestructure/services/location-watcher.service";
import { NodeMailerService } from "../infraestructure/services/nodemailes.service";

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

    // Middleware CORS
    const isDev = process.env.NODE_ENV === 'dev';
    const allowedOrigins = [
      'https://escoly.org',
      'https://www.escoly.org',
      'https://api.escoly.org',
    ];

    if (!isDev) {
      this.app.use(cors({
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      }));
    } else {
      this.app.use(cors());
    }

    //Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded is postman

    //Views with ejs
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "views"));

    //Routes definition
    this.app.use(this.routes);

    //Socket
    const io = SocketService.init(this.httpServer);
    const socketEventHandler = initializeSocketEventHandler(io);
    const emailService = new NodeMailerService();
    const firebaseLocationWatcher = new LocationWatcherService(emailService);
    firebaseLocationWatcher.startWatching();
    socketEventHandler.registerEvents();


    this.httpServer.listen(this.port, () => {
      buildLogger("Server").log(`Server started on port ${this.port}`);
    });
  }
}
