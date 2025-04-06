import { RoleEnum } from "../../enums/role.enum";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class ShowUsersUseCase {
    abstract execute(): Promise<any>;
}

interface User {
    id: number;
    names: string;
    fatherLastName: string;
    motherLastName: string;
    email: string;
}

export class ShowUsers implements ShowUsersUseCase {

    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly role: RoleEnum
    ) { }

    async execute(): Promise<User[]> {
        const users = await this.adminRepository.getUsers(this.role);
        return users.map((user) => {
            return {
                id: user.userId,
                names: user.names,
                fatherLastName: user.fathersLastName,
                motherLastName: user.mothersLastName,
                email: user.email,
            }
        })
    }
}