import { RegisterStudentDTO } from "../../dtos/admin/register-student.dto";
import { StudentEntity } from "../../entities/student.entity";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class RegisterStudentUseCase {
    abstract execute(registerStudentDTO: RegisterStudentDTO): Promise<any>;
}

export class RegisterStudent implements RegisterStudentUseCase {

    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(registerStudentDTO: RegisterStudentDTO): Promise<StudentEntity> {
        return await this.adminRepository.registerStudent(registerStudentDTO);
    }

}