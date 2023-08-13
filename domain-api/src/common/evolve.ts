import { Aggregate, DomainEvent } from '@root/common';

export type CommandEventEvolver<A extends Aggregate> = (state: A | undefined, event: DomainEvent<string, unknown>) => A;

const evolveWithEvent = <A extends Aggregate>(state: A | undefined, event: DomainEvent<string, unknown>, evolvers: CommandEventEvolver<A>[]): A => {
    for (let index = 0; index < evolvers.length; index++) {
        const commandEventEvolve = evolvers[index];
        const result = commandEventEvolve(state, event);
        if (result) {
            return result;
        }
    }

    throw new Error('No evolver for event: ' + JSON.stringify(event, null, 4));
};

export const evolve = <A extends Aggregate>(events: DomainEvent<string, unknown>[], evolvers: CommandEventEvolver<A>[]): A => {
    let state: A | undefined = undefined;
    for (let index = 0; index < events.length; index++) {
        const event = events[index];
        state = evolveWithEvent(state, event, evolvers);
    }

    return state;
};
