import { GuardianDataSource } from "../../domain/datasources/guardian.datasource";
import { GuardianRepository } from "../../domain/repositories/guardian.repository";

export class GuardianRepositoryImpl implements GuardianRepository {
    constructor(
        private readonly datasource: GuardianDataSource
    ) { }

    getStudents(id: number): Promise<any[]> {
        return this.datasource.getStudents(id);
    }

}