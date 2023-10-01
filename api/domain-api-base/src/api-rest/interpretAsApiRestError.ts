import express, { Request as ExpressReq, Response as ExpressRes } from 'express';
import {
    CommandAggregateRuleError,
    CommandIndexRuleError,
    CommandRuleError,
    ValidationError,
    AggregatLoadError,
} from '@root/domain';
import { Logger } from '@root/common';

export type ApiRestError = {
    result: 'error';
    type: string;
    messages: string[];
};

export const interpretAsApiRestError = (
    res: ExpressRes,
    err: unknown,
    logger: Logger,
): express.Response<ApiRestError, Record<string, any>> => {
    if (err instanceof ValidationError) {
        logger.error('ValidationError', err);
        return res.status(500).json({
            result: 'error',
            type: 'ValidationError',
            messages: err.validationErrors,
        });
    }
    if (err instanceof CommandRuleError) {
        logger.error('CommandRuleError', err);
        return res.status(500).json({
            result: 'error',
            type: 'CommandRuleError',
            messages: err.ruleErrors,
        });
    }
    if (err instanceof CommandAggregateRuleError) {
        logger.error('CommandAggregateRuleError', err);
        return res.status(500).json({
            result: 'error',
            type: 'CommandAggregateRuleError',
            messages: err.ruleErrors,
        });
    }
    if (err instanceof CommandIndexRuleError) {
        logger.error('CommandIndexRuleError', err);
        return res.status(500).json({
            result: 'error',
            type: 'CommandAggregateRuleError',
            messages: err.ruleErrors,
        });
    }
    if (err instanceof AggregatLoadError) {
        logger.error('AggregatLoadError', err);
       return res.status(500).json({
            result: 'error',
            type: 'AggregatLoadError',
            messages: ['Aggregate Load Error'],
        });
    }
    if (err instanceof Error) {
        logger.error('Error', err);
        return res.status(500).json({
            result: 'error',
            type: 'Error',
            messages: ['Error... TBD'], // TODO
        });
    }

    logger.error('Unknown Error', new Error()); // TODO
    return res.status(500).json({
        result: 'error',
        type: 'Unknown Error',
        messages: ['Unknown Error'],
    });
};
