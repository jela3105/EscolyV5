import { Request, Response } from "express";
import { AdminRepository, ShowUsers } from "../../domain";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";
import { RegisterUserDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { RegisterUser } from "../../domain/use-cases/admin/register-user.user-case";
import { EmailService } from "../../domain/services/email/email.service";
import { TokenRepository } from "../../domain/repositories/token.repository";
import { ShowGroups } from "../../domain/use-cases/admin/show-groups.user-case";
import { RegisterGroupDTO } from "../../domain/dtos/admin/register-group.dto";
import { RegisterGroup } from "../../domain/use-cases/admin/register-group.user-case";
import { RoleEnum } from "../../domain/enums/role.enum";
import { RegisterStudentDTO } from "../../domain/dtos/admin/register-student.dto";
import { RegisterStudent } from "../../domain/use-cases/admin/register-student.user-case";
import { ShowGroupById } from "../../domain/use-cases/admin/show-group-by-id.user-case";
import { ShowStudentInfoById } from "../../domain/use-cases/admin/show-student-info-by-id.user-case";
import { UpdateUserDTO } from "../../domain/dtos/admin/update-user.dto";
import { UpdateUser } from "../../domain/use-cases/admin/update-user.user-case";
import { UpdateStudentDTO } from "../../domain/dtos/admin/update-student.dto";
import { UpdateStudent } from "../../domain/use-cases/admin/update-student.user-case";
import { UnlinkGuardians as UnlinkGuardian } from "../../domain/use-cases/admin/unlink-guardians.user-case";
import { LinkGuardianToStudent } from "../../domain/use-cases/admin/link-guardian-to-student.user-case";

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

    registerStudent = (req: Request, res: Response) => {
        const [error, registerStudentDTO] = RegisterStudentDTO.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        new RegisterStudent(this.adminRepository)
            .execute(registerStudentDTO!)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

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

    getAdmins = (req: Request, res: Response) => this.getUserType(req, res, RoleEnum.ADMIN);

    getGroups = (req: Request, res: Response) => {
        new ShowGroups(this.adminRepository)
            .execute()
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

    getGroupDescription = (req: Request, res: Response) => {
        const { id } = req.params;
        const numericId = Number(id);
        new ShowGroupById(this.adminRepository)
            .execute(numericId)
            .then(data => res.json(data))
            .catch(error => HttpErrorHandler.handleError(error, res));
    }

    getGuardians = (req: Request, res: Response) => this.getUserType(req, res, RoleEnum.GUARDIAN);

    getStudentInfo = (req: Request, res: Response) => {
        const { id } = req.params;
        const numericId = Number(id);

        new ShowStudentInfoById(this.adminRepository)
            .execute(numericId)
            .then(data => res.json(data))
            .catch(error => HttpErrorHandler.handleError(error, res))
    }

    getStudentsWithoutGroup = (req: Request, res: Response) => {
        this.adminRepository.getStudentsWithoutGroup()
            .then((data) => {
                const studentsWithoutGroup = data.map((student) => ({
                    id: student.id,
                    names: student.names,
                    fathersLastName: student.fathersLastName,
                    mothersLastName: student.mothersLastName,
                }
                ));
                res.json(studentsWithoutGroup);
            })
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    getUserType = (req: Request, res: Response, role: RoleEnum) => {
        new ShowUsers(this.adminRepository, role)
            .execute()
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    getTeachers = (req: Request, res: Response) => this.getUserType(req, res, RoleEnum.TEACHER);

    linkGuardianToStudent = (req: Request, res: Response) => {
        const { studentId, guardianId } = req.body;
        const numericStudentId = Number(studentId);
        const numericGuardianId = Number(guardianId);

        if (isNaN(numericStudentId) || isNaN(numericGuardianId)) {
            res.status(400).json({ error: "Valor de estudiante o tutor invalido" });
            return;
        }

        new LinkGuardianToStudent(this.adminRepository)
            .execute(numericStudentId, numericGuardianId)
            .then(() => res.sendStatus(204))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    assignStudentsToGroup = (req: Request, res: Response) => {
        const { groupId, studentsId } = req.body;

        if (!groupId || !studentsId) {
            res.status(400).json({ error: "Falta grupo o studiantes" });
            return;
        }

        if (!Array.isArray(studentsId)) {
            res.status(400).json({ error: "Incorrecto formato de datos" });
            return;
        }

        const numericGroupId = Number(groupId);
        const numericStudentIds = studentsId.map((id: string) => Number(id));
        const hasInvalidStudentId = numericStudentIds.some((id: any) => isNaN(id) || !Number.isInteger(id));

        if (isNaN(numericGroupId) || hasInvalidStudentId) {
            res.status(400).json({ error: "Grupo o ids de estudiantes no validos" });
            return;
        }

        this.adminRepository.assignStudentsToGroup(numericGroupId, numericStudentIds)
            .then(() => res.sendStatus(204))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }


    unlinkGuardianFromStudent = (req: Request, res: Response) => {
        const { studentId, guardianId } = req.body;
        const numericStudentId = Number(studentId);

        if (isNaN(numericStudentId)) {
            res.status(400).json({ error: "Invalid student ID" });
            return;
        }

        new UnlinkGuardian(this.adminRepository)
            .execute(numericStudentId, guardianId)
            .then(() => res.sendStatus(204))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    updateUser = (req: Request, res: Response) => {
        const { id } = req.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }

        const [error, updateUserDTO] = UpdateUserDTO.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        new UpdateUser(this.adminRepository)
            .execute(numericId, updateUserDTO!)
            .then((data) => {
                const { password, token, ...user } = data;
                res.json(user);
            })
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

    updateStudent = (req: Request, res: Response) => {
        const { id } = req.params;
        const numericId = Number(id);

        if (isNaN(numericId)) {
            res.status(400).json({ error: "Invalid student ID" });
            return;
        }

        const [error, updateStudentDTO] = UpdateStudentDTO.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        new UpdateStudent(this.adminRepository)
            .execute(numericId, updateStudentDTO!)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    };

}
