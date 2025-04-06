import { Transporter, createTransport } from "nodemailer"
import { EmailService, SendMailOptions } from "../../domain/services/email/email.service";
import { EmailConfigService } from "../../config/email-service";
import { buildLogger } from "../../config";


export class NodeMailerService implements EmailService {
    private transporter: Transporter;
    private logger = buildLogger("NodeMailerService");

    constructor(emailConfigService: EmailConfigService = EmailConfigService.getInstance()) {
        const emailConfig = emailConfigService.getConfig()

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

            return true;
        } catch (error: any) {
            this.logger.error(`Error sending email: ${error}`);
            return false;
        }
    }

}