import { RegisterGroupDTO } from "../dtos/admin/register-group.dto";
import { RegisterStudentDTO } from "../dtos/admin/register-student.dto";
import { RegisterUserDTO } from "../dtos/admin/register-teacher.dto";
import { UpdateStudentDTO } from "../dtos/admin/update-student.dto";
import { UpdateUserDTO } from "../dtos/admin/update-user.dto";
import { GroupEntity } from "../entities/group.entity";
import { StudentDescriptionEntity } from "../entities/student-description.entity";
import { StudentEntity } from "../entities/student.entity";
import { UserEntity } from "../entities/user.entity";
import { RoleEnum } from "../enums/role.enum";

export abstract class AdminDataSource {
    abstract assignStudentsToGroup(groupId: number, studentIds: number[]): Promise<void>;
    abstract assignTeacherToGroup(groupId: number, teacherId: number): Promise<void>;
    abstract getGroups(): Promise<GroupEntity[]>;
    abstract getUsers(role: RoleEnum): Promise<UserEntity[]>;
    abstract linkGuardianToStudent(studentId: number, guardianId: number): Promise<void>
    abstract registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void>
    abstract registerUser(registerUserDTO: RegisterUserDTO, role: RoleEnum): Promise<UserEntity>
    abstract updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<UserEntity>
    abstract registerStudent(registerStudentDTO: RegisterStudentDTO): Promise<StudentEntity>
    abstract unlinkGuardiansFromStudent(studentId: number, guardianId: number): Promise<void>
    abstract updateStudent(id: number, updateStudentDTO: UpdateStudentDTO): Promise<void>
    abstract getGroupById(id: number): Promise<any>
    abstract getStudentById(id: number): Promise<StudentDescriptionEntity>
    abstract getStudentsWithoutGroup(): Promise<StudentEntity[]>;
}