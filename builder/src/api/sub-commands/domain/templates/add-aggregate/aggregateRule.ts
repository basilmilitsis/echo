import * as voca from 'voca';

type AggregateRuleModel = {
    aggregateName: string;
};

export const buildModel_aggregate = (
    aggregateName: string,
): AggregateRuleModel => ({
    aggregateName: `${voca.titleCase(aggregateName)}`,
});
