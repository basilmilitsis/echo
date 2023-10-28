export class CommandAuthRuleError extends Error {
    constructor(message: string, public ruleErrors: string[]) {
        super(message);
    }
}
