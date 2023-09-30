import { CommandKind } from '@root/common/CommandKind';
import * as voca from 'voca';

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
