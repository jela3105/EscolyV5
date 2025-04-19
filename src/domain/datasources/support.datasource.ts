import { CreateTicketDTO } from "../dtos/support/CreateTicketDTO";

export abstract class SupportDataSource {

    abstract createTicket(createTicketDTO: CreateTicketDTO, userId: number): Promise<void>;
    abstract getAllByUserId(id: number): Promise<any[]>;

}