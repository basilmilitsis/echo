import { EvolverSetsForAggregate, evolve } from "./evolve";
import { Aggregate, Command, CommandContext } from "../types";

export const loadAggregate = async <C extends Command, A extends Aggregate>(
    command: C,
    aggregateName: string,
    evolvers: EvolverSetsForAggregate<A>,
    context: CommandContext
): Promise<A> => {
    const aggregateEvents = await context.eventStream.findEvents(aggregateName, command.id);
    if(!aggregateEvents) {
        throw new Error('aggregateEvents not found');
    }
    const aggregate: A = evolve(aggregateName, aggregateEvents, evolvers);

    context.logger.localDiagnosticWithObject('aggregate', aggregate);
    
    return aggregate;
};