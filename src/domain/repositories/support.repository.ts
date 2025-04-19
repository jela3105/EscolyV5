import { CreateTicketDTO } from "../dtos/support/CreateTicketDTO";

export abstract class SupportRepository {
    abstract createTicket(createTicketDTO: CreateTicketDTO, userId: number): Promise<void>;
}