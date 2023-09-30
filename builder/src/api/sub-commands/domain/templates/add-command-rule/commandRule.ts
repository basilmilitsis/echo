import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

type CommandRuleModel = {
    commandName: string;
    commandFileName: string;
    ruleFunctionName: string;
};

export const buildModel_commandRule = (
    commandName: string,
    commandKind: CommandKind,
    ruleName: string
): CommandRuleModel => ({
    commandName: `${voca.titleCase(commandName)}`,
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
    ruleFunctionName: voca.camelCase(ruleName),
});
