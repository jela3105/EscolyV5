export interface SendMailOptions{
    from: string,
    to: string[] | string,
    subject: string,
    htmlBody: string
}

export abstract class EmailService {
    abstract sendEmail(sendMailOptions: SendMailOptions): Promise<boolean>;
}
