import * as voca from 'voca';

type CreateEventModel = {
    aggregateName: string;
    aggregateFileName: string;
    isFunctionName: string;
    isFunctionFileName: string;
    evolveFunctionName: string;
};

export const buildModel_evolveCreateEvent = (aggregateName: string, eventName: string): CreateEventModel => ({
    aggregateName: `${voca.titleCase(aggregateName)}`,
    aggregateFileName: `${voca.titleCase(aggregateName)}`,
    isFunctionName: `is${voca.titleCase(eventName)}_V1`,
    isFunctionFileName: `${voca.titleCase(eventName)}_V1.is`,
    evolveFunctionName: `evolve${voca.titleCase(eventName)}_V1`,
});
