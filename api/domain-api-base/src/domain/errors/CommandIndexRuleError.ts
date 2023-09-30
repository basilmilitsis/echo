export class CommandIndexRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
}
