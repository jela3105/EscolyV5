import { RegisterTeacherDTO } from "../../dtos/admin/register-teacher.dto";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class RegisterTeacerUserCase {
    abstract execute(registerTeacherDto: RegisterTeacherDTO): Promise<any>;
}


export class RegisterTeacher implements RegisterTeacerUserCase {

    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(registerTeacherDto: RegisterTeacherDTO): Promise<any> {
        return await this.adminRepository.registerTeacher(registerTeacherDto);
    }

}