import { RegisterGroupDTO } from "../dtos/admin/register-group.dto";
import { RegisterUserDTO } from "../dtos/admin/register-teacher.dto";
import { GroupEntity } from "../entities/group.entity";
import { UserEntity } from "../entities/user.entity";
import { RoleEnum } from "../enums/role.enum";

export abstract class AdminRepository {
  abstract getTeachers(): Promise<UserEntity[]>;
  abstract registerUser(registerTeacherDto: RegisterUserDTO, role: RoleEnum): Promise<UserEntity>
  abstract getGroups(): Promise<GroupEntity[]>;
  abstract registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void>
}