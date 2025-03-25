import { create } from "domain";
import { JwtAdapter } from "../../../config";
import { RegisterTeacherDTO } from "../../dtos/admin/register-teacher.dto";
import { HttpError } from "../../errors/http.error";
import { AdminRepository } from "../../repositories/admin.repository";
import { EmailService } from "../../services/email/email.service";
import { SentEmail } from "../email/sent-email.user-case";

abstract class RegisterTeacerUserCase {
    abstract execute(registerTeacherDto: RegisterTeacherDTO): Promise<any>;
}

export interface RegisterTeacherDependencies {
    adminRepository: AdminRepository,
    emailService: EmailService,
    url: string,
}

export class RegisterTeacher implements RegisterTeacerUserCase {

    private readonly adminRepository: AdminRepository;
    private readonly emailService: EmailService;
    private readonly url: string;

    constructor(dependencies: RegisterTeacherDependencies) {
        const { adminRepository, emailService, url } = dependencies;

        this.adminRepository = adminRepository;
        this.emailService = emailService;
        this.url = url;
    }

    async execute(registerTeacherDto: RegisterTeacherDTO): Promise<any> {

        const createdTeacher = await this.adminRepository.registerTeacher(registerTeacherDto);
        const email = registerTeacherDto.email;
        const token = await JwtAdapter.generateToken({ email }, 86400);
        if (!token) throw HttpError.internalServerError('Error generating token');
        const link = `${this.url}/auth/create-password/${token}`;

        new SentEmail(this.emailService, {
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
        }).execute();

        return createdTeacher;
    }
}