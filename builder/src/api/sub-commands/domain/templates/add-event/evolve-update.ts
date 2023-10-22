import * as voca from 'voca';

type UpdateEventModel = {
    aggregateName: string;
    aggregateFileName: string;
    evolveFunctionName: string;
    eventDataTypename: string;
    eventFileName: string;
};

export const buildModel_evolveUpdateEvent = (aggregateName: string, eventName: string): UpdateEventModel => ({
    aggregateName: `${voca.titleCase(aggregateName)}`,
    aggregateFileName: `${voca.titleCase(aggregateName)}`,
    evolveFunctionName: `evolve${voca.titleCase(eventName)}_V1`,
    eventDataTypename: `${voca.titleCase(eventName)}Data_V1`,
    eventFileName: `${voca.titleCase(eventName)}_V1.event`,
});
