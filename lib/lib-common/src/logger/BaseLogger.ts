import { Serializable } from '@root/types';

export interface BaseLogger {
    info(message: string, context: Serializable): void;
    warn(message: string, context: Serializable): void;
    error(message: string, error: Error, context: Serializable): void;
    localDiagnostic(message: string): void;
    localDiagnosticWithObject(message: string, object: Object): void;
    localDiagnosticWithObjects(message: string, objects: Object[]): void;
}
