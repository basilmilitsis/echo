import * as voca from 'voca';

type UpsertEventModel = {
    aggregateName: string;
    aggregateFileName: string;
    evolveFunctionName: string;
    eventDataTypeName: string;
    eventFileName: string;
};

export const buildModel_evolveUpsertEvent = (aggregateName: string, eventName: string): UpsertEventModel => ({
    aggregateName: `${voca.titleCase(aggregateName)}`,
    aggregateFileName: `${voca.titleCase(aggregateName)}`,
    evolveFunctionName: `evolve${voca.titleCase(eventName)}_V1`,
    eventDataTypeName: `${voca.titleCase(eventName)}Data_V1`,
    eventFileName: `${voca.titleCase(eventName)}_V1.event`,
});
