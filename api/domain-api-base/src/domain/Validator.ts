import { Command } from './Command';

export type Validator<C extends Command> = (command: C) => string[];

export class ValidationError extends Error {
    constructor(message: string, public validationErrors: string[]) {
        super(message);
    }
} 