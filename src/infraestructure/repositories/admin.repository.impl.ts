import { UserEntity } from "../../domain";
import { AdminDataSource } from "../../domain/datasources/admin.datasource";
import { AdminRepository } from "../../domain/repositories/admin.repository";

export class AdminRepositoryImpl implements AdminRepository {

    constructor(
        private readonly datasource: AdminDataSource
    ) { }

    getTeachers(): Promise<UserEntity[]> {
        return this.datasource.getTeachers();
    }
}
