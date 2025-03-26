import { GroupEntity } from "../../domain/entities/group.entity";

export class GroupEntityMapper {

    static groupEntityFromObject(object: { [key: string]: any }): GroupEntity {

        const { groupId, Yearr: year, groupName: name, teacher} = object;
        //TODO: Add validation

        return new GroupEntity(
            groupId,
            year,
            name,
            teacher
        );
    }
}