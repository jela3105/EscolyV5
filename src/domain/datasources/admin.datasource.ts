import { RegisterTeacherDTO } from "../dtos/admin/register-teacher.dto";
import { GroupEntity } from "../entities/group.entity";
import { UserEntity } from "../entities/user.entity";

export abstract class AdminDataSource {
    abstract getTeachers(): Promise<UserEntity[]>;
    abstract registerTeacher(registerTeacherDto : RegisterTeacherDTO) : Promise<UserEntity>
    abstract getGroups(): Promise<GroupEntity[]>;
}