import * as voca from 'voca';

type HandleUpdateModel = {
    functionName: string;
    commandTypeName: string;
    commandFileName: string;
    aggregateTypeName: string;
    aggregateFileName: string;
};

export const buildModel_handleUpsert = (commandName: string, aggregateName: string): HandleUpdateModel => ({
    functionName: `handle${voca.titleCase(commandName)}`,
    commandTypeName: voca.titleCase(commandName),
    commandFileName: `${voca.titleCase(commandName)}.upsert.command`,
    aggregateTypeName: voca.titleCase(aggregateName),
    aggregateFileName: voca.titleCase(aggregateName),
});
