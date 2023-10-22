import {
    EventStoreDBClient,
    JSONEventType,
    FORWARDS,
    START,
    StreamNotFoundError,
    jsonEvent,
} from '@eventstore/db-client';
import { BaseLogger, Logger } from '@echo/lib-common';
import { CommandEventData, DomainEvent, EventStream } from './types';
import { ApiRestEnvironment } from '@root/api-rest';

export class DefaultEventStream implements EventStream {
    private client: EventStoreDBClient;
    constructor(initLogger: BaseLogger) {
        initLogger.localDiagnostic('DefaultEventStream: connecting...');
        this.client = new EventStoreDBClient(
            {
                endpoint: `${ApiRestEnvironment.apiRest_eventstoreDB_host}:${ApiRestEnvironment.apiRest_eventstoreDB_port}`,
            },
            {
                insecure: true,
            }
        );
        initLogger.localDiagnostic('DefaultEventStream: CONNECTED!');
    }

    async findEvents(streamName: string, aggregateId: string): Promise<DomainEvent<string>[]> {
        const stream = this.client.readStream<JSONEventType>(
            `${streamName}-${aggregateId}`,
            {
                direction: FORWARDS,
                fromRevision: START,
                maxCount: 10,
            },
            {}
        );
        const events: DomainEvent<string>[] = [];

        try {
            for await (const resolvedEvent of stream) {
                if (!resolvedEvent.event) {
                    throw new Error('No event found');
                }
                events.push({
                    id: resolvedEvent.event.id,
                    type: resolvedEvent.event.type,
                    aggregateId: resolvedEvent.event.streamId.replace(`${streamName}-`, ''),
                    data: resolvedEvent.event?.data as unknown as CommandEventData,
                    meta: {}, // TODO resolvedEvent.event.metadata
                });
            }
        } catch (error) {
            if (error instanceof StreamNotFoundError) {
                return [];
            }
            throw error;
        }
        return events;
    }
    async addEvents(streamName: string, aggregateId: string, events: DomainEvent<string>[]): Promise<void> {
        await this.client.appendToStream(
            `${streamName}-${aggregateId}`,
            events.map((x) =>
                jsonEvent<JSONEventType>({
                    id: x.id,
                    type: x.type,
                    data: x.data,
                    metadata: x.meta,
                })
            ),
            {
                expectedRevision: 'any',
            }
        );
    }
}
