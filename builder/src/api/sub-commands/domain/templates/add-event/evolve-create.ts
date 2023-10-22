import * as voca from 'voca';

type CreateEventModel = {
    aggregateName: string;
    aggregateFileName: string;
    evolveFunctionName: string;
};

export const buildModel_evolveCreateEvent = (aggregateName: string, eventName: string): CreateEventModel => ({
    aggregateName: `${voca.titleCase(aggregateName)}`,
    aggregateFileName: `${voca.titleCase(aggregateName)}`,
    evolveFunctionName: `evolve${voca.titleCase(eventName)}_V1`,
});
