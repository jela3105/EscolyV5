import { GuardianDataSource } from "../../domain/datasources/guardian.datasource";
import { CreateTicketDTO } from "../../domain/dtos/support/CreateTicketDTO";
import { GuardianRepository } from "../../domain/repositories/guardian.repository";

export class GuardianRepositoryImpl implements GuardianRepository {
    constructor(
        private readonly datasource: GuardianDataSource
    ) { }

}