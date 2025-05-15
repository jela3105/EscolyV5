import { UpdateUserDTO } from "../../dtos/admin/update-user.dto";
import { UserEntity } from "../../entities/user.entity";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class UpdateUserUseCase {
    abstract execute(id: number, updateUserDTO: UpdateUserDTO): Promise<UserEntity>;
}

export class UpdateUser implements UpdateUserUseCase {
    constructor(private readonly adminRepository: AdminRepository) { }

    async execute(id: number, updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
        return await this.adminRepository.updateUser(id, updateUserDTO);
    }
} 