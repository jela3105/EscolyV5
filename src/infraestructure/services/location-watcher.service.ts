import { db } from "../firebase/firebase.service";
import { Server as SocketIOServer } from "socket.io";
import { LocationEntry } from "../../domain/entities/location.entity";
import { SocketService } from "./socket.service";
import { getSocketEventHandler } from "../websocket/socket-event-handler";

export class LocationWatcherService {
    constructor(
        private io: SocketIOServer
    ) { }

    public startWatching() {
        const devicesRef = db.ref("dispositivos");

        devicesRef.once("value", (snapshot) => {
            snapshot.forEach((deviceSnap) => {
                const deviceId = deviceSnap.key!;
                this.listenToHistorial(deviceId);
            });
        });

        devicesRef.on("child_added", (deviceSnap) => {
            const deviceId = deviceSnap.key!;
            this.listenToHistorial(deviceId);
        });
    }

    private listenToHistorial(deviceId: string) {
        const historyRef = db.ref(`dispositivos/${deviceId}/historial_ubicacion`);

        historyRef.on("child_added", (locationSnap) => {
            const data = locationSnap.val() as LocationEntry;

            const io = SocketService.getIO();
            const socketEventHandler = getSocketEventHandler();

            if (!socketEventHandler) throw new Error("Socket not initialized");

            const socketId = socketEventHandler.rooms.get(deviceId);

            if (socketId) {
                console.log("Enviando ubicacion a socketId: ", socketId);
                console.log(data)
                io.to(socketId).emit("location-update", {
                    deviceId: deviceId,
                    lat: data.latitude,
                    lng: data.longitude,
                    dateTime: data.dateTime,
                    batery: data.batery,
                });
            }

            this.io.emit("nueva_ubicacion", {
                dispositivo: deviceId,
                ubicacion: data,
            });
        });
    }
}
