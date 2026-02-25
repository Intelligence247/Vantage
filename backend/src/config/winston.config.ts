import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

const isProduction = process.env.NODE_ENV === 'production';

export const winstonConfig = WinstonModule.forRoot({
  level: isProduction ? 'info' : 'debug',
  format: isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      )
    : winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : '';
          return `${timestamp as string} [${level}]: ${message as string}${metaStr}`;
        }),
      ),
  transports: [
    new winston.transports.Console(),
    ...(isProduction
      ? []
      : [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ]),
  ],
});
