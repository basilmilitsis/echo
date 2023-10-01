import winston from 'winston';
const LogstashTransport = require('winston-logstash/lib/winston-logstash-latest');
import { Serializable } from '@root/common';

export class BaseLogger {
    logger: winston.Logger;
    constructor() {
        this.logger = winston.createLogger({
            // TODO: consider defaults
            //level: 'info',
            //format: winston.format.json(),
            format: winston.format.combine(
                //winston.format.label({ label: 'right meow!' }),
                //winston.format.timestamp({alias: 'myTimeStamp'}),
                winston.format.prettyPrint()
            ),
            transports: [
                new winston.transports.Console(),
                new LogstashTransport({
                    port: 5000,
                    node_name: 'my node name',
                    host: '127.0.0.1',
                }),
            ],
        });
    }
    info(message: string, context: Serializable): void {
        this.logger.info(message, { context: context });
    }
    warn(message: string, context: Serializable): void {
        this.logger.warn(message, { context: context });
    }
    error(message: string, error: Error, context: Serializable): void {
        this.logger.error(message, {
            error: { name: error.name, message: error.message, cause: error.cause, stack: error.stack },
            context: context,
        });
    }
}
