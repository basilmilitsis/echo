export class CommandAggregateRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
}
