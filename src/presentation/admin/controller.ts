import { Request, Response } from "express";
import { AdminRepository, ShowTeachers } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RegisterTeacher } from "../../domain/use-cases/admin/register-teacher.user-case";
import { EmailService } from "../../domain/services/email/email.service";
import { TokenRepository } from "../../domain/repositories/token.repository";
import { ShowGroups } from "../../domain/use-cases/admin/show-groups.user-case";
import { RegisterGroupDTO } from "../../domain/dtos/admin/register-group.dto";
import { RegisterGroup } from "../../domain/use-cases/admin/register-group.user-case";

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

        new RegisterTeacher({
            adminRepository: this.adminRepository,
            emailService: this.emailService,
            url: this.url,
        })
            .execute(registerTeacherDto!)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

    getGroups = (req: Request, res: Response) => {
        new ShowGroups(this.adminRepository)
            .execute()
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

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
}
