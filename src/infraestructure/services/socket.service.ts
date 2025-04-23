import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export class SocketService {
    private static io: SocketIOServer;

    public static init(server: HttpServer): SocketIOServer {
        this.io = new SocketIOServer(server, {
            cors: { origin: "*" },
        });
        return this.io;
    }

    public static getIO(): SocketIOServer {
        if (!this.io) {
            throw new Error("Socket.IO has not been initialized.");
        }
        return this.io;
    }
}
