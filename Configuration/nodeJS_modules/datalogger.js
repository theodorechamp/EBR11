import winston from 'winston';

const { combine, errors, json, printf, timestamp, colorize } = winston.format;

const transports = [
	new winston.transports.File({
		filename: process.env.LOG_FILE || 'logs/app.log',
		format: json()
	})
];

if (process.env.NODE_ENV === 'development') {
	transports.push(new winston.transports.Console({
		format: combine(
			colorize(),
			printf(({ level, message, timestamp: logTimestamp }) =>
				`${logTimestamp} ${level}: ${message}`)
		)
	}));
}

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: combine(
		timestamp(),
		errors({ stack: true })
	),
	transports
});

console.log(`Logger initialized with level: ${logger.level}`);
export { logger };
