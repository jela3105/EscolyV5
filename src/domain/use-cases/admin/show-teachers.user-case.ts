import { AdminRepository } from "../../repositories/admin.repository";

abstract class ShowTeachersUseCase {
    abstract execute(): Promise<any>;
}

export class ShowTeachers implements ShowTeachersUseCase {

    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(): Promise<any> {
        const users = await this.adminRepository.getTeachers();
        return {
            teachers: users.map((user) => {
                return {
                    id: user.userId,
                    name: user.names,
                    email: user.email,
                    roleId: user.roleId
                }
            })
        }; 
    }
}