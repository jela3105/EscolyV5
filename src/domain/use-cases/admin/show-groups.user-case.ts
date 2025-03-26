import { AdminRepository } from "../../repositories/admin.repository";

abstract class ShowGroupsUseCase {
    abstract execute(): Promise<any>;
}

interface Group{
    id: number;
    teacher: string;
    year: number;
    name: string;
}

export class ShowGroups implements ShowGroupsUseCase {

    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(): Promise<Group[]> {
        const groups = await this.adminRepository.getGroups();
        return groups.map((group) => {
                return {
                    id: group.groupId,
                    teacher: group.teacher,
                    year: group.year,
                    name: group.name,
                }
            })
    }
}