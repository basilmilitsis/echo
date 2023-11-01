import { Command, CommandContext, CommandEvent, DomainEvent } from "../types";

export const raiseEvents = async <C extends Command>(
    command: C,
    aggregateName: string,
    commandEvents: CommandEvent[],
    context: CommandContext
): Promise<void> => {
    context.logger.localDiagnosticWithObjects('events to raise:', commandEvents);
    const domainEvents: DomainEvent<string>[] = commandEvents.map(
        (x): DomainEvent<string> => ({
            id: context.generateUuid(),
            type: x.type,
            //kind: DomainEventKind.Create,
            aggregateId: x.id,
            data: x.data,
            meta: {
                correlationId: '', // TODO
            },
        })
    );
    await context.eventStream.addEvents(aggregateName, command.id, domainEvents);
    context.logger.localDiagnosticWithObjects('raising domainEvents:', domainEvents);
};