import { RegisterGroupDTO } from "../dtos/admin/register-group.dto";
import { RegisterStudentDTO } from "../dtos/admin/register-student.dto";
import { RegisterUserDTO } from "../dtos/admin/register-teacher.dto";
import { GroupDescriptionEntity } from "../entities/group-description.entity";
import { GroupEntity } from "../entities/group.entity";
import { StudentEntity } from "../entities/student.entity";
import { UserEntity } from "../entities/user.entity";
import { RoleEnum } from "../enums/role.enum";

export abstract class AdminRepository {
  abstract getUsers(role: RoleEnum): Promise<UserEntity[]>;
  abstract registerUser(registerTeacherDto: RegisterUserDTO, role: RoleEnum): Promise<UserEntity>
  abstract getGroups(): Promise<GroupEntity[]>;
  abstract registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void>
  abstract registerStudent(registerStudentDTO: RegisterStudentDTO): Promise<StudentEntity>
  abstract getGroupById(id: number): Promise<GroupDescriptionEntity>;
}