import { register } from "module";
import { UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { RegisterUserDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { AdminRepository } from "../../domain/repositories/admin.repository";
import { GroupEntity } from "../../domain/entities/group.entity";
import { RegisterGroupDTO } from "../../domain/dtos/admin/register-group.dto";
import { RoleEnum } from "../../domain/enums/role.enum";
import { RegisterStudentDTO } from "../../domain/dtos/admin/register-student.dto";
import { StudentEntity } from "../../domain/entities/student.entity";
import { GroupDescriptionEntity } from "../../domain/entities/group-description.entity";
import { StudentDescriptionEntity } from "../../domain/entities/student-description.entity";
import { UpdateStudentDTO } from "../../domain/dtos/admin/update-student.dto";
import { UpdateUserDTO } from "../../domain/dtos/admin/update-user.dto";

export class AdminRepositoryImpl implements AdminRepository {

    constructor(
        private readonly datasource: AdminDataSource
    ) { }

    registerStudent(registerStudentDTO: RegisterStudentDTO): Promise<StudentEntity> {
        return this.datasource.registerStudent(registerStudentDTO);
    }

    unlinkGuardiansFromStudent(studentId: number, guardianId: number): Promise<void> {
        return this.datasource.unlinkGuardiansFromStudent(studentId, guardianId);
    }

    updateStudent(id: number, updateStudentDTO: UpdateStudentDTO): Promise<void> {
        return this.datasource.updateStudent(id, updateStudentDTO);
    }

    getUsers(role: RoleEnum): Promise<UserEntity[]> {
        return this.datasource.getUsers(role);
    }

    registerUser(registerUserDTO: RegisterUserDTO, role: RoleEnum): Promise<UserEntity> {
        return this.datasource.registerUser(registerUserDTO, role);
    }

    getGroups(): Promise<GroupEntity[]> {
        return this.datasource.getGroups();
    }

    getGroupById(id: number): Promise<GroupDescriptionEntity> {
        return this.datasource.getGroupById(id);
    }

    linkGuardianToStudent(studentId: number, guardianId: number): Promise<void> {
        return this.datasource.linkGuardianToStudent(studentId, guardianId);
    }

    registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void> {
        return this.datasource.registerGroup(registerGroupDTO);
    }

    getStudentInfoById(id: number): Promise<StudentDescriptionEntity> {
        return this.datasource.getStudentById(id);
    }

    updateUser(id: number, updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
        return this.datasource.updateUser(id, updateUserDTO);
    }
}
