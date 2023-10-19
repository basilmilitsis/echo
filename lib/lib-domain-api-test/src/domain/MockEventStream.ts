import { DomainEvent, EventStream } from '@echo/lib-domain-api';

export class MockEventStream implements EventStream {
    private events: DomainEvent<string>[] = [];

    async findEvents(streamName: string, aggregateId: string): Promise<DomainEvent<string>[]> {
        return this.events.filter((x) => x.aggregateId === aggregateId);
    }
    async addEvents(streamName: string, aggregateId: string, events: DomainEvent<string>[]): Promise<void> {
        this.events = events;
    }
}
