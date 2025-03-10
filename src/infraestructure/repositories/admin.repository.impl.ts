import { register } from "module";
import { UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { RegisterTeacherDTO } from "../../domain/dtos/admin/register-teacher.dto";
import { AdminRepository } from "../../domain/repositories/admin.repository";

export class AdminRepositoryImpl implements AdminRepository {

    constructor(
        private readonly datasource: AdminDataSource
    ) { }

    getTeachers(): Promise<UserEntity[]> {
        return this.datasource.getTeachers();
    }

    registerTeacher(registerTeacherDto: RegisterTeacherDTO): Promise<UserEntity> {
        return this.datasource.registerTeacher(registerTeacherDto);
    }
}
