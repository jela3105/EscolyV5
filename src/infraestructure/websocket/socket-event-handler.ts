import { Server, Socket } from 'socket.io';
import { MysqlDatabase } from '../../data/mysql';

export class SocketEventHandler {
    constructor(private readonly io: Server) { }
    public rooms = new Map<string, string>(); // deviceId -> socketId
    private connections = new Map<string, string[]>(); // socketId -> devices

    public registerEvents(): void {
        this.io.on('connection', (socket: Socket) => {

            socket.on('subscribe-guardian', async () => {
                this.connections.set(socket.id, []);

                //TODO: Use clean architecture practices lol
                const pool = await MysqlDatabase.getPoolInstance();
                try {
                    const [rows] = await pool.query(`SELECT deviceId from Guardian 
                        INNER JOIN Student ON Guardian.studentId = Student.studentId 
                        INNER JOIN User ON User.userId = Guardian.userId WHERE User.userId = ?`,
                        [socket.data.payload.id]);

                    const devices = rows as any[];

                    devices.forEach((device: any) => {
                        if (device.deviceId === null)
                            return
                        this.rooms.set(device.deviceId, socket.id);
                        this.connections.get(socket.id)?.push(device.deviceId);
                    });
                } catch (error: any) {
                    console.error(`${error.code} ${error}`);
                }

                socket.join(socket.id);

            });

            socket.on('disconnect', () => {
                this.connections.get(socket.id)?.forEach((deviceId) => {
                    this.rooms.delete(deviceId);
                });

                this.connections.delete(socket.id);

            });
        });
    }
}

// Export the instance
let socketEventHandler: SocketEventHandler | null = null;

export function initializeSocketEventHandler(io: Server): SocketEventHandler {
    if (!socketEventHandler) {
        socketEventHandler = new SocketEventHandler(io);
    }
    return socketEventHandler;
}

export function getSocketEventHandler(): SocketEventHandler {
    if (!socketEventHandler) {
        throw new Error('SocketEventHandler is not initialized');
    }
    return socketEventHandler;
}
