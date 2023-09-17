import {
    CommandAggregateRuleError,
    CommandIndexRuleError,
    CommandRuleError,
    ValidationError,
    AggregatLoadError,
} from '@root/domain';

export type ApiRestError = {
    result: 'error';
    type: string;
    messages: string[];
};

export const interpretAsApiRestError = (err: unknown): ApiRestError => {
    if (err instanceof ValidationError) {
        console.log(`ValidationError: ${err.name} - errors: ${JSON.stringify(err.validationErrors, null, 4)}`);
        return {
            result: 'error',
            type: 'ValidationError',
            messages: err.validationErrors,
        };
    }
    if (err instanceof CommandRuleError) {
        console.log(`CommandRuleError: ${err.name} - errors: ${JSON.stringify(err.ruleErrors, null, 4)}`);
        return {
            result: 'error',
            type: 'CommandRuleError',
            messages: err.ruleErrors,
        };
    }
    if (err instanceof CommandAggregateRuleError) {
        console.log(`CommandAggregateRuleError: ${err.name} - errors: ${JSON.stringify(err.ruleErrors, null, 4)}`);
        return {
            result: 'error',
            type: 'CommandAggregateRuleError',
            messages: err.ruleErrors,
        };
    }
    if (err instanceof CommandIndexRuleError) {
        console.log(`CommandIndexRuleError: ${err.name} - errors: ${JSON.stringify(err.ruleErrors, null, 4)}`);
        return {
            result: 'error',
            type: 'CommandAggregateRuleError',
            messages: err.ruleErrors,
        };
    }
    if (err instanceof AggregatLoadError) {
        console.log(`AggregatLoadError: ${err.name}`);
        return {
            result: 'error',
            type: 'AggregatLoadError',
            messages: ['Aggregat Load Error'],
        };
    }
    if (err instanceof Error) {
        console.log(`Error: ${err.name}`);
        return {
            result: 'error',
            type: 'Error',
            messages: ['Error... TBD'], // TODO
        };
    }

    console.log(`Unknown Error`);
    return {
        result: 'error',
        type: 'Unknown Error',
        messages: ['Unknown Error'],
    };
};
