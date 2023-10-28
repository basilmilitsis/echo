import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

type AggregateAuthRuleModel = {
    aggregateName: string;
    aggregateFolderName: string;
    aggregateFileName: string;
    commandName: string;
    commandFolderName: string;
    commandFileName: string;
    ruleFunctionName: string;
};

export const buildModel_aggregateAuthRule = (
    aggregateName: string,
    commandName: string,
    commandKind: CommandKind,
    ruleName: string
): AggregateAuthRuleModel => ({
    aggregateName: `${voca.titleCase(aggregateName)}`,
    aggregateFolderName: `${voca.camelCase(aggregateName)}`,
    aggregateFileName: `${voca.titleCase(aggregateName)}`,
    commandName: `${voca.titleCase(commandName)}`,
    commandFolderName: `${voca.camelCase(commandName)}`,
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
    ruleFunctionName: voca.camelCase(ruleName),
});
