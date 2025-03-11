import { Request, Response } from "express";
import { AdminRepository, ShowTeachers } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RegisterTeacher } from "../../domain/use-cases/admin/register-teacher.user-case";
import { NodeMailerService } from "../../infraestructure/services/nodemailes.service";

export class AdminController {
    constructor(private readonly adminRepository: AdminRepository) { }

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

        const emailService = new NodeMailerService();

        emailService.sendEmail({
            from: "no-reply@escoly.org",
            to: ["jelab3105@gmail.com", "angelabenlencastillomartinez@gmail.com"],
            subject: "Crear cuenta en Escoly",
            htmlBody:
                `<h3> Hola <h3>
                <p> Este correo es prueba de la refactorizacion para usar el servicio de correo con arquitectura limpia funciona </p>`,
        })
            .then((sucess) => console.log(sucess))
            .catch((fail) => console.log(fail));

        new RegisterTeacher(this.adminRepository)
            .execute(registerTeacherDto!)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };
}
