import * as voca from 'voca';
import { CommandKind } from '@root/api/common';

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
