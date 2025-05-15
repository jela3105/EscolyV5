import { UpdateStudentDTO } from "../../dtos/admin/update-student.dto";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class UpdateStudentUseCase {
    abstract execute(id: number, updateStudentDTO: UpdateStudentDTO): Promise<void>;
}

export class UpdateStudent implements UpdateStudentUseCase {
    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(id: number, updateStudentDTO: UpdateStudentDTO): Promise<void> {
        return await this.adminRepository.updateStudent(id, updateStudentDTO);
    }
} 