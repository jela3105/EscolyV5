import { AdminRepository } from "../../repositories/admin.repository";

abstract class UnlinkGuadiansUseCase {
    abstract execute(studentId: number, guardianId: number): Promise<void>;
}

export class UnlinkGuardians implements UnlinkGuadiansUseCase {

    constructor(
        private readonly adminRepository: AdminRepository
    ) { }

    execute(studentId: number, guardianId: number): Promise<void> {
        return this.adminRepository.unlinkGuardiansFromStudent(studentId, guardianId);
    }
}
