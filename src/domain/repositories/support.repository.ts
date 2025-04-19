import { CreateTicketDTO } from "../dtos/support/CreateTicketDTO";

export abstract class SupportRepository {
    abstract createTicket(createTicketDTO: CreateTicketDTO, userId: number): Promise<void>;
    abstract getAllByUserId(id: number): Promise<any[]>;
    abstract getSeverities(): Promise<any[]>;
}