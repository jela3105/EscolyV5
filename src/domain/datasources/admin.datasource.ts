import { RegisterGroupDTO } from "../dtos/admin/register-group.dto";
import { RegisterStudentDTO } from "../dtos/admin/register-student.dto";
import { RegisterUserDTO } from "../dtos/admin/register-teacher.dto";
import { GroupEntity } from "../entities/group.entity";
import { StudentEntity } from "../entities/student.entity";
import { UserEntity } from "../entities/user.entity";
import { RoleEnum } from "../enums/role.enum";

export abstract class AdminDataSource {
    abstract getGroups(): Promise<GroupEntity[]>;
    abstract getUsers(role: RoleEnum): Promise<UserEntity[]>;
    abstract registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void>
    abstract registerUser(registerUserDTO: RegisterUserDTO, role: RoleEnum): Promise<UserEntity>
    abstract registerStudent(registerStudentDTO: RegisterStudentDTO): Promise<StudentEntity>
    abstract getGroupById(id: number): Promise<any>
}