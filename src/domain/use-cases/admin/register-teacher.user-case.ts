import { create } from "domain";
import { JwtAdapter } from "../../../config";
import { RegisterTeacherDTO } from "../../dtos/admin/register-teacher.dto";
import { HttpError } from "../../errors/http.error";
import { AdminRepository } from "../../repositories/admin.repository";
import { EmailService } from "../../services/email/email.service";

abstract class RegisterTeacerUserCase {
    abstract execute(registerTeacherDto: RegisterTeacherDTO): Promise<any>;
}


export class RegisterTeacher implements RegisterTeacerUserCase {

    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly emailService: EmailService,
        private readonly url: string
    ) { }

    //TODO: Convert to send email user case
    private async sendEmailToCreatePassword(email: string) {
        console.log(email)

        const token = await JwtAdapter.generateToken({ email });

        if (!token) throw HttpError.internalServerError('Error generating token');

        const link = `${this.url}/auth/create-password/${token}`;

        const isSend = await this.emailService.sendEmail({
            from: "no-reply@escoly.org",
            to: email,
            subject: "Creacion de contrasena para cuenta de Escoly",
            htmlBody:
                `<h1>Crear contrasena para poder acceder a Escoly</h1>
                <p> Por favor, cree su contrasena para poder crear su cuenta en Escoly </p>
                <a href="${link}">Crear contrasena para ${email} </a>
                `,
        })

        if(!isSend) throw HttpError.internalServerError("Could not send email to generate password")
    }

    async execute(registerTeacherDto: RegisterTeacherDTO): Promise<any> {
        const createdTeacher = await this.adminRepository.registerTeacher(registerTeacherDto);
        this.sendEmailToCreatePassword(registerTeacherDto.email);
        return createdTeacher;
    }

}