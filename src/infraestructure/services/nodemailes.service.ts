import { Transporter, createTransport } from "nodemailer"
import { EmailService, SendMailOptions } from "../../domain/services/email/email.service";
import { EmailConfigService } from "../../config/email-service";


export class NodeMailerService implements EmailService {
    private transporter: Transporter;

    constructor() {
        const emailConfig = EmailConfigService.getInstance().getConfig()

        this.transporter = createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass
            }
        })
    }

    async sendEmail(sendMailOptions: SendMailOptions): Promise<boolean> {
        const { from, to, subject, htmlBody } = sendMailOptions;

        try {
            const sentInformation = await this.transporter.sendMail({
                from,
                to,
                subject,
                html: htmlBody
            })
            console.log(sentInformation);

            return true;
        } catch (error: any) {
            console.error(error)
            return false;
        }
    }

}