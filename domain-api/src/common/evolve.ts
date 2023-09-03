import { Aggregate, CommandEventData, DomainEvent } from '@root/common';
import { string } from 'zod';

//export type CommandEventEvolver<A extends Aggregate> = (state: A | undefined, event: DomainEvent<string, unknown>) => A;

export type AggregateCreateEventEvolver<
    A extends Aggregate = Aggregate,
> = (event: DomainEvent<string>) => A;
export type AggregateUpdateEventEvolver<
    A extends Aggregate = Aggregate,
> = (state: A, event: DomainEvent<string>) => A;

//export type CommandEventEvolver<A extends Aggregate = Aggregate> = AggregateStartEvolver<A> | EventAggregateEvolver<A>;

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
};

export const evolve = <A extends Aggregate>(
    aggregateName: string,
    events: DomainEvent<string>[],
    aggregateEvolverSets: EvolverSetsForAggregate<A>[]
): A => {
    let state: A | undefined = undefined;

    const evolverSetsForAggregate = aggregateEvolverSets.find((set) => set.aggregateName === aggregateName);
    const createSets = evolverSetsForAggregate?.createEventEvolverSets;
    const updateSets = evolverSetsForAggregate?.updateEventEvolverSets || [];

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

        if (!state) {
            throw new Error('No state after create events');
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
