import { BaseLogger, Logger, Serializable } from '@echo/lib-common';
import { OperationContext } from './types';

export class DomainLogger implements Logger {
    constructor(
        private logger: BaseLogger,
        private operationContext: OperationContext
    ) {}
    info(message: string): void {
        this.logger.info(message, this.operationContext);
    }
    warn(message: string): void {
        this.logger.warn(message, this.operationContext);
    }
    error(message: string, error: Error): void {
        this.logger.error(message, error, this.operationContext);
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
