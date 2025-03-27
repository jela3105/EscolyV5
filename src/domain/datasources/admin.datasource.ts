import { RegisterGroupDTO } from "../dtos/admin/register-group.dto";
import { RegisterTeacherDTO } from "../dtos/admin/register-teacher.dto";
import { GroupEntity } from "../entities/group.entity";
import { UserEntity } from "../entities/user.entity";

export abstract class AdminDataSource {
    abstract getGroups(): Promise<GroupEntity[]>;
    abstract getTeachers(): Promise<UserEntity[]>;
    abstract registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void>
    abstract registerTeacher(registerTeacherDto : RegisterTeacherDTO) : Promise<UserEntity>
}