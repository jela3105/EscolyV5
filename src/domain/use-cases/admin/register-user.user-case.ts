import { create } from "domain";
import { JwtAdapter } from "../../../config";
import { RegisterUserDTO } from "../../dtos/admin/register-teacher.dto";
import { HttpError } from "../../errors/http.error";
import { AdminRepository } from "../../repositories/admin.repository";
import { EmailService } from "../../services/email/email.service";
import { SentEmail } from "../email/sent-email.user-case";
import { RoleEnum } from "../../enums/role.enum";

abstract class RegisterUserUseCase {
    abstract execute(registerUserDTO: RegisterUserDTO, role: RoleEnum): Promise<any>;
}

export interface RegisterUserDependencies {
    adminRepository: AdminRepository,
    emailService: EmailService,
    url: string,
}

export class RegisterUser implements RegisterUserUseCase {

    private readonly adminRepository: AdminRepository;
    private readonly emailService: EmailService;
    private readonly url: string;

    constructor(dependencies: RegisterUserDependencies) {
        const { adminRepository, emailService, url } = dependencies;

        this.adminRepository = adminRepository;
        this.emailService = emailService;
        this.url = url;
    }

    async execute(registerUserDTO: RegisterUserDTO, role: RoleEnum): Promise<any> {

        const createdUser = await this.adminRepository.registerUser(registerUserDTO, role);
        const email = registerUserDTO.email;
        const token = await JwtAdapter.generateToken({ email }, 86400);
        if (!token) throw HttpError.internalServerError('Error generating token');
        const link = `${this.url}/auth/create-password/${token}`;
        let roleString: string;

        switch (role) {
            case RoleEnum.ADMIN: roleString = "administrador/a"; break;
            case RoleEnum.TEACHER: roleString = "profesor/a"; break;
            case RoleEnum.GUARDIAN: roleString = "tutor/a"; break;
        }

        new SentEmail(this.emailService, {
            from: "no-reply@escoly.org",
            to: email,
            subject: "Creacion de contraseña para cuenta de Escoly",
            htmlBody: `<h1>Cree su contraseña</h1>
                <p> Usted fue añadido/a por un administrador para crear una cuenta como ${roleString}, por favor de 
                <a href="${link}">click aqui</a> para crear su contraseña y poder tener acceso.</p>
                
                <p> Si tiene problemas para dar click, por favor copie y pegue el siguiente link en su navegador: </p>
                <a href="${link}"> ${link} </a>

                <p><b><i>*Solamente puede dar click una vez el link, en caso de que haya problemas pongase en contacto con su administardor*</i></b></p>
                `,
        }).execute();

        return createdUser;
    }
}