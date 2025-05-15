import { StudentDescriptionEntity } from "../../entities/student-description.entity";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class ShowStudentByIdUseCase {
    abstract execute(id: number): Promise<StudentDescriptionEntity>;
}

export class ShowStudentInfoById implements ShowStudentByIdUseCase {

    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(id: number): Promise<StudentDescriptionEntity> {
        const student = await this.adminRepository.getStudentInfoById(id);
        return student;
    }
}