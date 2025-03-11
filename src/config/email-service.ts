import { envs } from "./envs";

export interface EmailConfig {
    user: string;
    pass: string;
    service: string;
}

export class EmailConfigService {
    private static instance: EmailConfigService;
    private config: EmailConfig;

    private constructor(configuration: EmailConfig) {
        this.config = configuration
    }

    public static getInstance(): EmailConfigService {

        if (!this.instance) {
            this.instance = new EmailConfigService({
                user: envs.MAILER_EMAIL,
                pass: envs.MAILER_SECRET_KEY,
                service: envs.MAILER_SERVICE
            });
        }

        return this.instance;
    }

    public getConfig(): EmailConfig {
        return this.config;
    }
}
