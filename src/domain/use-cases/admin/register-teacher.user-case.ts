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
          subject: "Creacion de contraseña para cuenta de Escoly",
          htmlBody: `<h1>Cree su contraseña</h1>
                <p> Usted fue añadido/a por un administrador para crear una cuenta como profesor/a, por favor de 
                <a href="${link}">click aqui</a> para crear su contraseña y poder tener acceso.</p>
                
                <p> Si tiene problemas para dar click, por favor copie y pegue el siguiente link en su navegador: </p>
                <a href="${link}"> ${link} </a>

                <p><b><i>*Solamente puede dar click una vez el link, en caso de que haya problemas pongase en contacto con su administardor*</i></b></p>
                `,
        });

        if(!isSend) throw HttpError.internalServerError("Could not send email to generate password")
    }

    async execute(registerTeacherDto: RegisterTeacherDTO): Promise<any> {
        const createdTeacher = await this.adminRepository.registerTeacher(registerTeacherDto);
        this.sendEmailToCreatePassword(registerTeacherDto.email);
        return createdTeacher;
    }

}