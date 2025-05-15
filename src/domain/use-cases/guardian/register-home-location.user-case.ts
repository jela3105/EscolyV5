
import { GuardianRepository } from "../../repositories/guardian.repository";

//TODO: In domain layer, we should not use firebase directly 
import { db as firebaseDatabase } from "../../../infraestructure/firebase/firebase.service";

abstract class RegisterHomeLocationUseCase {
    abstract execute(studentId: number, lat: number, lng: number, guardianId: number, houseName: string, radius: number): Promise<void>;
}

export class RegisterHomeLocation implements RegisterHomeLocationUseCase {
    constructor(private readonly guardianRepository: GuardianRepository) { }

    async execute(studentId: number, lat: number, lng: number, guardianId: number, houseName: string, radius: number): Promise<void> {
        try {
            const deviceId = await this.guardianRepository.getDeviceId(studentId, guardianId);
            if (!deviceId) {
                throw new Error("Dispositivo no encontrado");
            }

            await firebaseDatabase.ref(`safe_zones/houses/${deviceId}/${houseName}`).set({
                latitude: lat,
                longitude: lng,
                radius
            });


        } catch (error) {
            throw new Error("Error al obtener el dispositivo");
        }
    }
}