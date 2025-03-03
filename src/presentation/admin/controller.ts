import { Request, Response } from "express";
import { AdminRepository, ShowTeachers } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";

export class AdminController {
    constructor(private readonly adminRepository: AdminRepository) { }

    getTeachers = (req: Request, res: Response) => {

        new ShowTeachers(this.adminRepository)
            .execute()
            .then(data => res.json(data))
            .catch(error => HttpErrorHandler.handleError(error, res))
    };
}