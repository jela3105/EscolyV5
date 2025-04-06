import { resolve } from "path";
import { JwtAdapter } from "../../../config";
import { HttpError } from "../../errors/http.error";
import { EmailService } from "../../services/email/email.service";
import { SentEmail } from "../email/sent-email.user-case";
import { AuthRepository } from "../../repositories/auth.repository";

abstract class ForgetPasswordEmailUseCase {
    abstract execute(email: string): Promise<void>;
}

export class ForgetPasswordEmail implements ForgetPasswordEmailUseCase {

    constructor(
        private readonly emailService: EmailService,
        private readonly url: string,
        private readonly authRepository: AuthRepository
    ) {
    }

    async execute(email: string): Promise<void> {

        const user = await this.authRepository.userExists(email);
        if (!user) throw HttpError.notFound("User not found")

        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw HttpError.internalServerError('Error generating token');
        const link = `${this.url}/auth/change-password/${token}`;

        new SentEmail(this.emailService, {
            from: "no-reply@escoly.org",
            to: email,
            subject: "Recuperacion de contraseña para cuenta de Escoly",
            htmlBody: `
                <p> Usted solicito recuperar su contraseña en su cuenta escoly, por favor de 
                <a href="${link}">click aqui</a> para recuperar su contraseña.</p>
                
                <p> Si tiene problemas para dar click, por favor copie y pegue el siguiente link en su navegador: </p>
                <a href="${link}"> ${link} </a>

                <p>El link expira en dos horas</p>
                `
        }).execute();

        return;
    }
}