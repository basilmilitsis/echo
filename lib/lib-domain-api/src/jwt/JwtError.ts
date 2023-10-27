export class JwtError extends Error {
    constructor(message: string, cause: unknown) {
        super(message, {
            cause,
        });
    }
}
