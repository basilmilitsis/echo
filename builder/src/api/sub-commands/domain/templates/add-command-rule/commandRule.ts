import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

type CommandRuleModel = {
    aggregateFolderName: string;
    commandName: string;
    commandFolderName: string;
    commandFileName: string;
    ruleFunctionName: string;
};

export const buildModel_commandRule = (
    aggregateName: string,
    commandName: string,
    commandKind: CommandKind,
    ruleName: string
): CommandRuleModel => ({
    aggregateFolderName: `${voca.camelCase(aggregateName)}`,
    commandName: `${voca.titleCase(commandName)}`,
    commandFolderName: `${voca.camelCase(commandName)}`,
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
    ruleFunctionName: voca.camelCase(ruleName),
});
