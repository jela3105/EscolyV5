import { env } from "process";
import winston, { createLogger, format } from "winston";

const { combine, timestamp, json } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

export const buildLogger = (service: string) => {
    return {
        log: (message: string) => {
            logger.log('info', { service, message });
        },
        error: (message: string) => {
            logger.error('error', { service, message });
        }
    }
} 
