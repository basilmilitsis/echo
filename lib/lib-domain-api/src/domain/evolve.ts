import { Aggregate, DomainEvent } from './types';

export type AggregateCreateEventEvolver<A extends Aggregate = Aggregate> = (event: DomainEvent<string>) => A;
export type AggregateUpdateEventEvolver<A extends Aggregate = Aggregate> = (state: A, event: DomainEvent<string>) => A;
export type AggregateUpsertEventEvolver<A extends Aggregate = Aggregate> = (state: A | undefined, event: DomainEvent<string>) => A;

export type EvolverSetsForAggregate<A extends Aggregate> = {
    aggregateName: string;
    createEventEvolverSets: {
        eventName: string;
        evolver: AggregateCreateEventEvolver<A>;
    }[];
    updateEventEvolverSets: {
        eventName: string;
        evolver: AggregateUpdateEventEvolver<A>;
    }[];
    upsertEventEvolverSets: {
        eventName: string;
        evolver: AggregateUpsertEventEvolver<A>;
    }[];
};

export const evolve = <A extends Aggregate>(
    aggregateName: string,
    events: DomainEvent<string>[],
    aggregateEvolverSets: EvolverSetsForAggregate<A>[]
): A => {
    let state: A | undefined = undefined;

    const evolverSetsForAggregate = aggregateEvolverSets.find((set) => set.aggregateName === aggregateName);
    const createSets = evolverSetsForAggregate?.createEventEvolverSets || [];
    const updateSets = evolverSetsForAggregate?.updateEventEvolverSets || [];
    const upsertSets = evolverSetsForAggregate?.upsertEventEvolverSets || [];

    if (!evolverSetsForAggregate || !createSets) {
        throw new Error('No evolvers for aggregate: ' + aggregateName);
    }

    for (let e = 0; e < events.length; e++) {
        const event = events[e];

        for (let index = 0; index < createSets.length; index++) {
            const set = createSets[index];
            if (set.eventName === event.type) {
                state = set.evolver(event);
            }
        }

        for (let index = 0; index < upsertSets.length; index++) {
            const set = upsertSets[index];
            if (set.eventName === event.type) {
                state = set.evolver(state, event);
            }
        }

        if (!state) {
            throw new Error('Aggregate Load Error: No state after create & upsert events');
        }

        for (let index = 0; index < updateSets.length; index++) {
            const set = updateSets[index];
            if (set.eventName === event.type) {
                state = set.evolver(state, event);
            }
        }
    }

    if (!state) {
        throw new Error('Did not evolve state');
    }

    return state;
};
