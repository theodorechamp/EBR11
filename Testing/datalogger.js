import winston from 'winston';

const { combine, errors, json, printf, timestamp, colorize } = winston.format;

const formatSystemTimestamp = () => {
	const now = new Date();
	const pad = (value, width = 2) => String(value).padStart(width, '0');

	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;
};

const transports = [
	new winston.transports.File({
		filename: process.env.LOG_FILE || 'logs/app.log',
		format: json()
	})
];
console.log(process.env.NODE_ENV);

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
		timestamp({ format: formatSystemTimestamp }),
		errors({ stack: true })
	),
	transports
});

export { logger };
