import { DomainEvent } from './DomainEvent';

export interface EventStream {
    findEvents(streamName: string, aggregateId: string): Promise<DomainEvent<string>[]>;
    addEvents(streamName: string, aggregateId: string, events: DomainEvent<string>[]): Promise<void>;
}
