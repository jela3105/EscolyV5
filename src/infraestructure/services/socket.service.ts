import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { JwtAdapter } from "../../config";

export class SocketService {
    private static io: SocketIOServer;

    public static init(server: HttpServer): SocketIOServer {
        this.io = new SocketIOServer(server, {
            cors: { origin: "*" },
        });

        this.io.use((socket, next) => {
            const token = socket.handshake.auth?.token;

            JwtAdapter.validateToken<{ id: string, role: number }>(token)
                .then(async (payload) => {
                    if (!payload) {
                        return next(new Error("Unauthorized"));
                    }

                    socket.data.payload = payload;
                })
            next();
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
