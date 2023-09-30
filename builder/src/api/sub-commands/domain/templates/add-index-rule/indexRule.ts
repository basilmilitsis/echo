import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

type IndexRuleModel = {
    commandName: string;
    commandFileName: string;
    ruleFunctionName: string;
};

export const buildModel_indexRule = (
    commandName: string,
    commandKind: CommandKind,
    ruleName: string
): IndexRuleModel => ({
    commandName: `${voca.titleCase(commandName)}`,
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
    ruleFunctionName: voca.camelCase(ruleName),
});
