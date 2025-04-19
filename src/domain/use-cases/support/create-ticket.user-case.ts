import { CreateTicketDTO } from "../../dtos/support/CreateTicketDTO";
import { SupportRepository } from "../../repositories/support.repository";

abstract class CreateTicketUseCase {
    abstract execute(createTicketDTO: CreateTicketDTO, userId: number): Promise<void>;
}

export class CreateTicket implements CreateTicketUseCase {

    constructor(private readonly supportRepository: SupportRepository) { };

    async execute(createTicketDTO: CreateTicketDTO, userId: number): Promise<void> {
        await this.supportRepository.createTicket(createTicketDTO, userId);
    }
}

