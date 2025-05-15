import { Request, Response } from "express";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { GuardianRepository } from "../../domain/repositories/guardian.repository";
import { RegisterHomeLocation } from "../../domain/use-cases/guardian/register-home-location.user-case";

export class GuardianController {

    constructor(
        private readonly guardianRepository: GuardianRepository,
    ) { }

    getStudents = async (req: Request, res: Response) => {
        const { id } = req.body.payload;

        if (isNaN(id)) {
            res.status(400).json({ error: "Numero de usuario invalido" });
            return;
        }

        this.guardianRepository.getStudents(id)
            .then((students) => { res.status(200).json(students); })
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    updateDevice = async (req: Request, res: Response) => {
        const { studentId, deviceId } = req.body;

        if (!studentId || !deviceId) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        //convert studentId to number
        const studentIdNumber = parseInt(studentId);

        if (isNaN(studentIdNumber)) {
            res.status(400).json({ error: "Id estudiante invalido" });
            return;
        }

        if (deviceId.length !== 5) {
            res.status(400).json({ error: "Id dispositivo invalido" });
            return;
        }

        this.guardianRepository.updateDevice(studentIdNumber, deviceId, req.body.payload.id)
            .then(() => { res.status(200).json({ message: "Dispositivo actualizado" }); })
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    addHomeLocation = async (req: Request, res: Response) => {
        //TODO: Create DTO
        const { studentId, lat, lng, radius, houseName } = req.body;

        if (!studentId || !lat || !lng || !radius || !houseName) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        //convert studentId to number
        const studentIdNumber = parseInt(studentId);

        if (isNaN(studentIdNumber)) {
            res.status(400).json({ error: "Id estudiante invalido" });
            return;
        }

        new RegisterHomeLocation(this.guardianRepository)
            .execute(studentIdNumber, lat, lng, req.body.payload.id, houseName, radius)
            .then(() => { res.status(200).json({ message: "Ubicacion actualizada" }); })
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }
}