import { Server, Socket } from 'socket.io';

export class SocketEventHandler {
    constructor(private readonly io: Server) { }

    public registerEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log('Socket connected:', socket.id);

            socket.on('subscribe-to-device', (deviceId: string) => {
                socket.join(deviceId);
                console.log(`Socket ${socket.id} suscribed to ${deviceId}`);
            });

            socket.on('disconnect', () => {
                console.log('Socket desconectado:', socket.id);
            });
        });
    }
}
