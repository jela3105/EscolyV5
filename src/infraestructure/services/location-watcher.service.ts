import { db } from "../firebase/firebase.service";
import { LocationEntry } from "../../domain/entities/location.entity";
import axios from "axios";
import { envs } from "../../config";
import { SocketService } from "./socket.service";
import { getSocketEventHandler } from "../websocket/socket-event-handler";
import { SentEmail } from "../../domain/use-cases/email/sent-email.user-case";
import { EmailService } from "../../domain/services/email/email.service";
import { MysqlDatabase } from "../../data/mysql";

export class LocationWatcherService {

    private readonly emailService: EmailService;
    private lastCoordinates: Map<string, { lat: number, lng: number }> = new Map();
    private io = SocketService.getIO();
    private socketEventHandler = getSocketEventHandler();

    constructor(emailService: EmailService) {
        this.emailService = emailService;
    }

    public startWatching() {
        const devicesRef = db.ref("devices");

        devicesRef.once("value", (snapshot) => {
            snapshot.forEach((deviceSnap) => {
                const deviceId = deviceSnap.key!;
                this.listenToHistorial(deviceId);
            });
        });

        devicesRef.on("child_added", (deviceSnap) => {
            const deviceId = deviceSnap.key!;
            this.listenToHistorial(deviceId);
            this.listenSafeZone(deviceId);
        });
    }

    private listenToHistorial(deviceId: string) {
        const historyRef = db.ref(`devices/${deviceId}/location_history`);

        historyRef.on("child_added", (locationSnap) => {
            const data = locationSnap.val() as LocationEntry;

            if (!this.socketEventHandler) throw new Error("Socket not initialized");

            const socketId = this.socketEventHandler.rooms.get(deviceId);

            // Save last coordinates for this device
            this.lastCoordinates.set(deviceId, { lat: data.lat, lng: data.lng });

            if (socketId) {
                this.io.to(socketId).emit("location-update", {
                    deviceId: deviceId,
                    lat: data.lat,
                    lng: data.lng,
                    dateTime: data.dateTime,
                    batery: data.batery,
                });
            }

        });
    }

    private listenSafeZone(deviceId: string) {
        const onSafeZoneRef = db.ref(`devices/${deviceId}/in_safe_zone`);

        onSafeZoneRef.on("value", async (snapshot) => {
            const isInSafeZone = snapshot.val() as boolean;

            if (isInSafeZone !== true) {
                return;
            }

            try {
                const pool = await MysqlDatabase.getPoolInstance();

                const [rows] = await pool.query(`SELECT email from User 
                                                    INNER JOIN Guardian ON User.userID = Guardian.userId 
                                                    INNER JOIN Student ON Student.studentId = Guardian.studentId 
                                                    WHERE deviceID = ?`, [deviceId]);
                // Get last coordinates for this device
                const coords = this.lastCoordinates.get(deviceId);

                // Declaramos imageBuffer fuera por si no tenemos coordenadas
                let imageBuffer: Buffer | undefined = undefined;

                if (coords?.lat && coords?.lng) {
                    const apiKey = envs.MAPS_API_KEY;
                    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=18&size=400x400&markers=color:red%7C${coords.lat},${coords.lng}&key=${apiKey}`;

                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    imageBuffer = Buffer.from(response.data as string, 'binary');
                }

                // send email to every guardian found
                for (const row of rows as { email: string }[]) {
                    const attachments = imageBuffer
                        ? [{
                            filename: "map.png",
                            content: imageBuffer,
                            cid: "mapa_cid",
                            contentType: "image/png"
                        }]
                        : [];

                    await new SentEmail(this.emailService, {
                        from: "no-reply@escoly.org",
                        to: row.email,
                        subject: "Llegada a zona segura",
                        htmlBody: ` 
                            <h1>Este correo es una notificación</h1>
                            <p>Usted recibe este correo porque detectamos que el dispositivo con ID <b>${deviceId}</b> ha llegado a una zona considerada como segura.</p>
                            <p>La última ubicación compartida fue en las siguientes coordenadas: ${coords?.lat ?? "N/A"}, ${coords?.lng ?? "N/A"}</p>
                            ${imageBuffer
                                ? `<p>Ubicación:</p>
                                       <a href="https://www.google.com/maps/search/?api=1&query=${coords?.lat},${coords?.lng}" target="_blank">
                                           <img src="cid:mapa_cid" alt="Mapa de ubicación" />
                                       </a>`
                                : ''
                            }
                        `,
                        attachments
                    }).execute();
                }

                this.lastCoordinates.delete(deviceId);

            } catch (error) {
                console.error("Error fetching guardians:", error);
                return;
            }

            if (!this.socketEventHandler) throw new Error("Socket not initialized");

            const socketId = this.socketEventHandler.rooms.get(deviceId);

            if (socketId) {
                this.io.to(socketId).emit("safe-zone-update", {
                    deviceId: deviceId,
                    inSafeZone: isInSafeZone,
                });
            }


        });

    }
}
