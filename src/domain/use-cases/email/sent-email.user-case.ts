import { EmailService } from "../../services/email/email.service";

import { HttpError } from "../../errors/http.error";
abstract class SentEmailUseCase {
    abstract execute(): Promise<any>;
}

interface Email {
    from: string;
    to: string;
    subject: string;
    htmlBody: string;
    attachments?: { filename: string; content: Buffer; cid: string }[];
}

export class SentEmail implements SentEmailUseCase {

    private readonly emailService: EmailService;
    private readonly email: Email;

    constructor(emailService: EmailService, email: Email) {
        this.emailService = emailService;
        this.email = email;
    }

    async execute(): Promise<any> {
        const isSend = await this.emailService.sendEmail(this.email);
        if (!isSend) throw HttpError.internalServerError("Could not send email to generate password")
    }
}