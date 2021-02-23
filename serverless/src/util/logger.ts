import { createLogger, format, transports } from 'winston';

const {
    combine,
    errors,
    splat,
    json,
} = format;

const context = format(info => ({
    ...info,
}));

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        format.timestamp({
            format: 'YYYY-MM-DDTHH:mm:ss'
        }),
        errors({ stack: true }),
        context(),
        splat(),
        json()
    ),
    transports: [
        new transports.Console({
            silent: process.env.JEST_WORKER_ID !== undefined
        })
    ]
});

export default logger;