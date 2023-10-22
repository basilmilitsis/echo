export interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string, error: Error): void;

    localDiagnostic(message: string): void;
    localDiagnosticWithObject(message: string, object: Object): void;
    localDiagnosticWithObjects(message: string, objects: Object[]): void;
}
