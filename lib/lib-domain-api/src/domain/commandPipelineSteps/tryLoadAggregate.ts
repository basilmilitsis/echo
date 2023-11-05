import { EvolverSetsForAggregate, evolve } from "./evolve";
import { Aggregate, Command, CommandContext } from "../types";

export const tryLoadAggregate = async <C extends Command, A extends Aggregate>(
    command: C,
    aggregateName: string,
    evolvers: EvolverSetsForAggregate<A>,
    context: CommandContext
): Promise<A | undefined> => {
    const aggregateEvents = await context.eventStream.findEvents(aggregateName, command.id);
    if (!aggregateEvents || aggregateEvents.length === 0) {
        return undefined;
    }
    const aggregate: A = evolve(aggregateName, aggregateEvents, evolvers);
    context.logger.localDiagnosticWithObject('aggregate', aggregate);
    return aggregate;
};
