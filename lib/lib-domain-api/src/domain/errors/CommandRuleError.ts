export class CommandRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
}
