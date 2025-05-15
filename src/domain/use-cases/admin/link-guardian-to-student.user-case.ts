import { AdminRepository } from "../../repositories/admin.repository";

abstract class LinkGuardianUseCase {
    abstract execute(studentId: number, guardianId: number): Promise<void>;
}

export class LinkGuardianToStudent implements LinkGuardianUseCase {
    constructor(
        private readonly adminRepository: AdminRepository
    ) { }

    execute(studentId: number, guardianId: number): Promise<void> {
        return this.adminRepository.linkGuardianToStudent(studentId, guardianId);
    }
}