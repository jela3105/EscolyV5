import { GroupDescriptionEntity } from "../../entities/group-description.entity";
import { AdminRepository } from "../../repositories/admin.repository";

abstract class ShowGroupByIdUseCase {
    abstract execute(id: number): Promise<GroupDescriptionEntity>;
}

export class ShowGroupById implements ShowGroupByIdUseCase {

    constructor(
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(id: number): Promise<GroupDescriptionEntity> {
        const group = await this.adminRepository.getGroupById(id);
        return group;
    }
}