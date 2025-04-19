import { SupportDataSource } from "../../domain/datasources/support.datasource";
import { CreateTicketDTO } from "../../domain/dtos/support/CreateTicketDTO";
import { SupportRepository } from "../../domain/repositories/support.repository";

export class SupportRepositoryImpl implements SupportRepository {
    constructor(
        private readonly datasource: SupportDataSource
    ) { }

    createTicket(createTicketDTO: CreateTicketDTO, userId: number): Promise<void> {
        return this.datasource.createTicket(createTicketDTO, userId);
    }

    getAllByUserId(id: number): Promise<any[]> {
        return this.datasource.getAllByUserId(id);
    }
}