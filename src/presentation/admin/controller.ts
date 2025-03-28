import { Request, Response } from "express";
import { AdminRepository, ShowTeachers } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { RegisterUserDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RegisterUser } from "../../domain/use-cases/admin/register-teacher.user-case";
import { EmailService } from "../../domain/services/email/email.service";
import { TokenRepository } from "../../domain/repositories/token.repository";
import { ShowGroups } from "../../domain/use-cases/admin/show-groups.user-case";
import { RegisterGroupDTO } from "../../domain/dtos/admin/register-group.dto";
import { RegisterGroup } from "../../domain/use-cases/admin/register-group.user-case";
import { RoleEnum } from "../../domain/enums/role.enum";

export interface AdminControllerDependencies {
    adminRepository: AdminRepository,
    emailService: EmailService,
    url: string
    tokenRepository: TokenRepository
}

export class AdminController {

    private readonly adminRepository: AdminRepository;
    private readonly emailService: EmailService;
    private readonly url: string;
    private readonly tokenRepository: TokenRepository;

    constructor(dependencies: AdminControllerDependencies) {
        const { adminRepository, emailService, url, tokenRepository } = dependencies;
        this.adminRepository = adminRepository;
        this.emailService = emailService;
        this.url = url;
        this.tokenRepository = tokenRepository;
    }

    registerAdmin = (req: Request, res: Response) => this.registerUser(req, res, RoleEnum.ADMIN);

    registerGroup = (req: Request, res: Response) => {
        const [error, registerGroupDTO] = RegisterGroupDTO.create(req.body);

        if (error) {
            res.status(400).json({ error })
            return;
        }

        new RegisterGroup(this.adminRepository)
            .excecute(registerGroupDTO!)
            .then(() => res.sendStatus(201))
            .catch((error) => HttpErrorHandler.handleError(error, res))
    };

    registerGuardian = (req: Request, res: Response) => this.registerUser(req, res, RoleEnum.GUARDIAN);

    registerTeacher = (req: Request, res: Response) => this.registerUser(req, res, RoleEnum.TEACHER);

    registerUser = (req: Request, res: Response, role: RoleEnum) => {
        const [error, registerUserDto] = RegisterUserDTO.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        new RegisterUser({
            adminRepository: this.adminRepository,
            emailService: this.emailService,
            url: this.url,
        })
            .execute(registerUserDto!, role)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

    getGroups = (req: Request, res: Response) => {
        new ShowGroups(this.adminRepository)
            .execute()
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

    getGuardians = (req: Request, res: Response) => {

    };

    getTeachers = (req: Request, res: Response) => {
        new ShowTeachers(this.adminRepository)
            .execute()
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

}
