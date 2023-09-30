import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

type AggregateRuleModel = {
    aggregateName: string;
    aggregateFileName: string;
    commandName: string;
    commandFileName: string;
    ruleFunctionName: string;
};

export const buildModel_aggregateRule = (
    aggregateName: string,
    commandName: string,
    commandKind: CommandKind,
    ruleName: string
): AggregateRuleModel => ({
    aggregateName: `${voca.titleCase(aggregateName)}`,
    aggregateFileName: `${voca.titleCase(aggregateName)}`,
    commandName: `${voca.titleCase(commandName)}`,
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
    ruleFunctionName: voca.camelCase(ruleName),
});
