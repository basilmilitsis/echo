import { BaseLogger, Logger, Serializable } from '@echo/lib-common';
import { CommandMetadata } from './types';

export class DomainLogger implements Logger {
    constructor(
        private logger: BaseLogger,
        private commandMetadata: CommandMetadata
    ) {}
    info(message: string): void {
        this.logger.info(message, this.commandMetadata);
    }
    warn(message: string): void {
        this.logger.warn(message, this.commandMetadata);
    }
    error(message: string, error: Error): void {
        this.logger.error(message, error, this.commandMetadata);
    }
    localDiagnostic(message: string): void {
        this.logger.localDiagnostic(message);
    }
    localDiagnosticWithObject(message: string, object: Object): void {
        this.logger.localDiagnosticWithObject(message, object);
    }
    localDiagnosticWithObjects(message: string, objects: Object[]): void {
        this.logger.localDiagnosticWithObjects(message, objects);
    }
}
