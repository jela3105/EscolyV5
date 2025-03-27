import { RegisterGroupDTO } from "../../dtos/admin/register-group.dto";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class RegisterGroupUseCase {
    abstract excecute(registerGroupDTO: RegisterGroupDTO): Promise<void>;
}

export class RegisterGroup implements RegisterGroupUseCase {

    constructor(private readonly adminRepository: AdminRepository) { };

    async excecute(registerGroupDTO: RegisterGroupDTO): Promise<void> {
        await this.adminRepository.registerGroup(registerGroupDTO);
    }
}
