import { Request, Response } from "express";
import { AdminRepository, ShowTeachers } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RegisterTeacher } from "../../domain/use-cases/admin/register-teacher.user-case";
import { NodeMailerAdapter } from "../../config/nodemailer";

export class AdminController {
    constructor(private readonly adminRepository: AdminRepository) { }

    getTeachers = (req: Request, res: Response) => {

        new ShowTeachers(this.adminRepository)
            .execute()
            .then(data => res.json(data))
            .catch(error => HttpErrorHandler.handleError(error, res))
    };

    registerTeacher = (req: Request, res: Response) => {

        const [error, registerTeacherDto] = RegisterTeacherDTO.create(req.body);

        const emailService = new NodeMailerAdapter();

        emailService.sentEmail({
          to: ["@gmail.com"],
          subject: "Email de prueba",
          htmlBody: `
    <h3> Email de prueba </h3>
    <p> Este es un email de prueba auto generado para ver si si jala el enviar correos desde el back como no-reply@escoly.org </p>
    <p> Saludos </p>
    `,
        });

        console.log("sended")


        if (error) {
            res.status(400).json({ error });
            return;
        }

        new RegisterTeacher(this.adminRepository)
            .execute(registerTeacherDto!)
            .then(data => res.json(data))
            .catch(error => HttpErrorHandler.handleError(error, res))

    };
}