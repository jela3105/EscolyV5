import { createTransport, Transporter } from 'nodemailer';
import { envs } from './envs';

interface SendMailOptions {
    from: string
    to: string[] | string;
    subject: string;
    htmlBody: string;
}

export class NodeMailerAdapter {

    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailKey: string
    ) {
        this.transporter = createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: senderEmailKey,
            }
        });
    }

    async sentEmail(options: SendMailOptions): Promise<boolean> {
        const { from, to, subject, htmlBody } = options;
        try {

            const sentInformation = await this.transporter.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: htmlBody
            })

            return true;
        } catch (error) {
            return false;
        }

    }

}