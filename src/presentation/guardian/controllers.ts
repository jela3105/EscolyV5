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
}