import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

type IndexRuleModel = {
    aggregateFolderName: string,
    commandName: string;
    commandFolderName: string,
    commandFileName: string;
    ruleFunctionName: string;
};

export const buildModel_indexRule = (
    aggregateName: string,
    commandName: string,
    commandKind: CommandKind,
    ruleName: string
): IndexRuleModel => ({
    aggregateFolderName: `${voca.camelCase(aggregateName)}`,
    commandName: `${voca.titleCase(commandName)}`,
    commandFolderName: `${voca.camelCase(commandName)}`,
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
    ruleFunctionName: voca.camelCase(ruleName),
});
