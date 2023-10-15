export class ValidationError extends Error {
    constructor(message: string, public validationErrors: string[]) {
        super(message);
    }
}
