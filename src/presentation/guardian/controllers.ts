import { Request, Response } from "express";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { GuardianRepository } from "../../domain/repositories/guardian.repository";

export class GuardianController {

    constructor(
        private readonly guardianRepository: GuardianRepository,
    ) { }

    getStudents = async (req: Request, res: Response) => {
        res.status(200).json({ message: "GuardianController getStudents" });
    }

}