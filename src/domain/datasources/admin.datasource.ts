import { RegisterGroupDTO } from "../dtos/admin/register-group.dto";
import { RegisterUserDTO } from "../dtos/admin/register-teacher.dto";
import { GroupEntity } from "../entities/group.entity";
import { UserEntity } from "../entities/user.entity";
import { RoleEnum } from "../enums/role.enum";

export abstract class AdminDataSource {
    abstract getGroups(): Promise<GroupEntity[]>;
    abstract getTeachers(): Promise<UserEntity[]>;
    abstract registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void>
    abstract registerUser(registerUserDTO: RegisterUserDTO, role: RoleEnum): Promise<UserEntity>
}