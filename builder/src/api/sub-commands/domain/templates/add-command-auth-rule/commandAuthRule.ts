import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

type CommandAuthRuleModel = {
    aggregateFolderName: string;
    commandName: string;
    commandFolderName: string;
    commandFileName: string;
    ruleFunctionName: string;
};

export const buildModel_commandAuthRule = (
    aggregateName: string,
    commandName: string,
    commandKind: CommandKind,
    ruleName: string
): CommandAuthRuleModel => ({
    aggregateFolderName: `${voca.camelCase(aggregateName)}`,
    commandName: `${voca.titleCase(commandName)}`,
    commandFolderName: `${voca.camelCase(commandName)}`,
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
    ruleFunctionName: voca.camelCase(ruleName),
});
