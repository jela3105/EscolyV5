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

export class AdminRepositoryImpl implements AdminRepository {

    constructor(
        private readonly datasource: AdminDataSource
    ) { }

    registerStudent(registerStudentDTO: RegisterStudentDTO): Promise<StudentEntity> {
        return this.datasource.registerStudent(registerStudentDTO);
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

    registerGroup(registerGroupDTO: RegisterGroupDTO): Promise<void> {
        return this.datasource.registerGroup(registerGroupDTO);
    }
}
