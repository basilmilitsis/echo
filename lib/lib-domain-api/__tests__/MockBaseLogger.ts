import { BaseLogger, DefaultBaseLogger, Logger } from '@echo/lib-common';
import { CommandMetadata } from '@root/domain';

export class MockBaseLogger implements BaseLogger {
    constructor() {}
    infoMessages = [] as string[];
    info(message: string): void {
        this.infoMessages.push(message);
    }
    warnMessages = [] as string[];
    warn(message: string): void {
        this.warnMessages.push(message);
    }
    errorMessages = [] as {message: string, error: Error}[];
    error(message: string, error: Error): void {
        this.errorMessages.push({message, error});
    }
    localDiagnostic(message: string): void {}
    localDiagnosticWithObject(message: string, object: Object): void {}
    localDiagnosticWithObjects(message: string, objects: Object[]): void {}
}
