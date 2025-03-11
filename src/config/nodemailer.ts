import { createTransport } from 'nodemailer';
import { envs } from './envs';

interface SendMailOptions {
    to: string[] | string;
    subject: string;
    htmlBody: string;
}

export class NodeMailerAdapter {
    private transporter = createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY,
        }
    });

    async sentEmail(options: SendMailOptions): Promise<boolean> {

        const { to, subject, htmlBody } = options;
        try {

            const sentInformation = await this.transporter.sendMail({
                from: "@escoly.org",
                to: to,
                subject: subject,
                html: htmlBody
            })

            console.log(sentInformation);
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }

    }

}