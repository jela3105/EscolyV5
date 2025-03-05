import { AdminRepository } from "../../repositories/admin.repository";

abstract class ShowTeachersUseCase {
    abstract execute(): Promise<any>;
}

interface Teacher{
    id: number;
    names: string;
    fatherLastName: string;
    motherLastName: string;
    email: string;
}

export class ShowTeachers implements ShowTeachersUseCase {

    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(): Promise<Teacher[]> {
        const users = await this.adminRepository.getTeachers();
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