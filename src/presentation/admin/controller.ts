import { Request, Response } from "express";
import { AdminRepository, ShowTeachers } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RegisterTeacher } from "../../domain/use-cases/admin/register-teacher.user-case";
import { EmailService } from "../../domain/services/email/email.service";

export class AdminController {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly emailService: EmailService,
        private readonly url: string
    ) { }

    getTeachers = (req: Request, res: Response) => {
        new ShowTeachers(this.adminRepository)
            .execute()
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

    registerTeacher = (req: Request, res: Response) => {
        const [error, registerTeacherDto] = RegisterTeacherDTO.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        new RegisterTeacher(this.adminRepository, this.emailService, this.url)
            .execute(registerTeacherDto!)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };
}
