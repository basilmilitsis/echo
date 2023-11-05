import { Aggregate, DomainEvent } from '../types';

export type AggregateCreateEventEvolver<A extends Aggregate = Aggregate> = (event: DomainEvent<string>) => A;
export type AggregateUpdateEventEvolver<A extends Aggregate = Aggregate> = (state: A, event: DomainEvent<string>) => A;
export type AggregateUpsertEventEvolver<A extends Aggregate = Aggregate> = (
    state: A | undefined,
    event: DomainEvent<string>
) => A;

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
    aggregateEvolverSets: EvolverSetsForAggregate<A>
): A => {
    let state: A | undefined = undefined;

    const createSets = aggregateEvolverSets.createEventEvolverSets;
    const updateSets = aggregateEvolverSets.updateEventEvolverSets;
    const upsertSets = aggregateEvolverSets.upsertEventEvolverSets;

    if (createSets.length === 0 && upsertSets.length === 0 && updateSets.length === 0) {
        throw new Error('No known evolvers for aggregate: ' + aggregateName);
    }

    for (let e = 0; e < events.length; e++) {
        const event = events[e];
        let processedEvolver = false;

        for (let index = 0; index < createSets.length; index++) {
            const set = createSets[index];

            if (set.eventName === event.type) {
                if (state) {
                    throw new Error('Aggregate Load Error: create event found after aggregate created');
                }

                state = set.evolver(event);
                processedEvolver = true;
                break;
            }
        }
        if (processedEvolver) {
            continue;
        }

        for (let index = 0; index < upsertSets.length; index++) {
            const set = upsertSets[index];
            if (set.eventName === event.type) {
                state = set.evolver(state, event);
                processedEvolver = true;
                break;
            }
        }
        if (processedEvolver) {
            continue;
        }
        if (!state) {
            throw new Error('Aggregate Load Error: No state after create & upsert events');
        }

        for (let index = 0; index < updateSets.length; index++) {
            const set = updateSets[index];
            if (set.eventName === event.type) {
                state = set.evolver(state, event);
                processedEvolver = true;
                break;
            }
        }

        if (!processedEvolver) {
            throw new Error(
                `Aggregate Load Error: Unknown event found. AggregateName: [${aggregateName}], AggregateId: [${event.aggregateId}], EventId: [${event.id}], EventType: [${event.type}]`
            );
        }
    }

    if (!state) {
        throw new Error('Did not evolve state');
    }

    return state;
};
