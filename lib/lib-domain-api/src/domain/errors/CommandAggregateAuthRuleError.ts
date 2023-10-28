export class CommandAggregateAuthRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
}
