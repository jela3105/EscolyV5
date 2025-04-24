import { Request, Response } from "express";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { GuardianRepository } from "../../domain/repositories/guardian.repository";

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
        const { studentId, lat, lng } = req.body;

        if (!studentId || !lat || !lng) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        //convert studentId to number
        const studentIdNumber = parseInt(studentId);

        if (isNaN(studentIdNumber)) {
            res.status(400).json({ error: "Id estudiante invalido" });
            return;
        }

        this.guardianRepository.addHomeLocation(studentIdNumber, lat, lng, req.body.payload.id)
            .then(() => { res.status(200).json({ message: "Ubicacion actualizada" }); })
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    updateHomeLocation = async (req: Request, res: Response) => {
        //TODO: validate if they are actual coordinates
        const { lat, lng } = req.body;

        const { locationId } = req.params;

        const locationIdNumber = parseInt(locationId);

        if (!lat || !lng) {
            res.status(400).json({ error: "Faltan datos" });
            return;
        }

        this.guardianRepository.updateHomeLocation(locationIdNumber, lat, lng, req.body.payload.id)
            .then(() => { res.status(200).json({ message: "Ubicacion actualizada" }); })
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

}