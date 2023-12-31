const LogstashTransport = require('winston-logstash/lib/winston-logstash-latest');
import winston from 'winston';
import { Serializable } from '@root/types';
import { RootEnvironment } from '@root/environment';
import { BaseLogger } from './BaseLogger';

export class DefaultBaseLogger implements BaseLogger {
    logger: winston.Logger;
    constructor() {
        this.logger = winston
            .createLogger({
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
                        node_name: 'my node name',
                        host: RootEnvironment.logToHost,
                        port: RootEnvironment.logToPort,
                    }),
                ],
                exitOnError: false, // do not exit on handled exceptions
            })
            .add(
                new winston.transports.File({
                    filename: 'error-transport.log',
                    handleExceptions: true,
                })
            );
        this.logger.info(`Log to: ${RootEnvironment.logToHost}:${RootEnvironment.logToPort}`, {});
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
    localDiagnostic(message: string): void {
        if (RootEnvironment.production) {
            return;
        }
        console.log(message); // TODO: consider using winston
    }
    localDiagnosticWithObject(message: string, object: Object): void {
        if (RootEnvironment.production) {
            return;
        }
        console.log(message, JSON.stringify(object, null, 4)); // TODO: consider using winston
    }
    localDiagnosticWithObjects(message: string, objects: Object[]): void {
        if (RootEnvironment.production) {
            return;
        }
        console.log(message, JSON.stringify(objects, null, 4)); // TODO: consider using winston
    }
}
