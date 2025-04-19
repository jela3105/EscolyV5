import { Request, Response } from "express";
import { CreateTicketDTO } from "../../domain/dtos/support/CreateTicketDTO";
import { SupportRepository } from "../../domain/repositories/support.repository";
import { EmailService } from "../../domain/services/email/email.service";
import { CreateTicket } from "../../domain/use-cases/support/create-ticket.user-case";
import { HttpErrorHandler } from "../errors-handler/http-errors-handler";

export class SupportController {

    constructor(
        private readonly emailService: EmailService,
        private readonly supportRepository: SupportRepository
    ) { }

    getAllTicketsByUserId = (req: Request, res: Response) => {
        const { id } = req.body.payload;

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid user id" });
            return;
        }

        this.supportRepository.getAllByUserId(id)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    getSeverity = (req: Request, res: Response) => {
        this.supportRepository.getSeverities()
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

    createTicket = (req: Request, res: Response) => {
        const { id } = req.body.payload;

        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid user id" });
            return;
        }

        const [error, createTicketDTO] = CreateTicketDTO.create(req.body);

        if (error) {
            res.status(400).json({ error })
            return;
        }

        new CreateTicket(this.supportRepository)
            .execute(createTicketDTO!, id)
            .then((data) => res.json(data))
            .catch((error) => HttpErrorHandler.handleError(error, res));
    }

}