import { CommandKind } from '@root/common/CommandKind';
import * as voca from 'voca';

type ValidateModel = {
    functionName: string;
    commandTypeName: string;
    commandFileName: string;
};

export const buildModel_validate = (commandName: string, commandKind: CommandKind): ValidateModel => ({
    functionName: `validate${voca.titleCase(commandName)}`,
    commandTypeName: voca.titleCase(commandName),
    commandFileName: `${voca.titleCase(commandName)}.${commandKind}.command`,
});
