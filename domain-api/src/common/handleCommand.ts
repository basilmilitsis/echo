import { v4 as uuidv4 } from 'uuid';

import { Aggregate, Command, CommandEventData, DomainEvent, EventStream, Handler } from '@root/common';
import { CommandEventEvolver, evolve } from './evolve';

export const handleCommand = async <C extends Command, A extends Aggregate, CED extends CommandEventData>(
    aggregateName: string,
    command: C,
    evolvers: CommandEventEvolver<A>[],
    handle: Handler<C, A, CED>,
    eventStream: EventStream
) => {
    console.log('========================================================================');

    const aggregateEvents = await eventStream.findEvents(aggregateName, command.id);
    console.log('======> found events: ', JSON.stringify(aggregateEvents, null, 4));

    const aggregate: A = evolve(aggregateEvents, evolvers);
    console.log('======> aggregate ', JSON.stringify(aggregate, null, 4));

    const commandEvents = handle(command, aggregate);
    console.log('======> handled events ', JSON.stringify(commandEvents, null, 4));

    const domainEvents: DomainEvent<string, CommandEventData>[] = commandEvents.map(
        (x): DomainEvent<string, CommandEventData> => ({
            id: uuidv4(),
            type: x.type,
            aggregateId: x.id,
            data: x.data,
            meta: {
                correlationId: '', // TODO
            },
        })
    );

    await eventStream.addEvents(aggregateName, command.id, domainEvents);
    console.log('======> added domainEvents ', JSON.stringify(domainEvents, null, 4));
    console.log('========================================================================');
};
