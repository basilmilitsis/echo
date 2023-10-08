import { EventStoreDBClient, JSONEventType, FORWARDS, START, StreamNotFoundError, jsonEvent } from "@eventstore/db-client";
import { CommandEventData, DomainEvent, EventStream } from "./types";
import { ApiRestEnvironment } from "@root/api-rest";

export class DefaultEventStream implements EventStream {
    private client: EventStoreDBClient;
    constructor() {
        console.log('........ connecting.....');
        this.client = new EventStoreDBClient(
            {
                endpoint: `${ApiRestEnvironment.apiRest_eventstoreDB_host}:${ApiRestEnvironment.apiRest_eventstoreDB_port}`,
            },
            {
                insecure: true,
            }
        );
        console.log('........ CONNECTED!!!.....');
    }

    async findEvents(
        streamName: string,
        aggregateId: string
    ): Promise<DomainEvent<string>[]> {
        console.log('====> reading events...');
        const stream = this.client.readStream<JSONEventType>(
            `${streamName}-${aggregateId}`,
            {
                direction: FORWARDS,
                fromRevision: START,
                maxCount: 10,
            },
            {}
        );
        console.log('====> reading events... have stream');
        const events: DomainEvent<string>[] = [];

        try {
            for await (const resolvedEvent of stream) {
                console.log('====> reading events... adding event');
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
                //console.log(resolvedEvent.event?.data);
            }
        } catch (error) {
            if (error instanceof StreamNotFoundError) {
                console.log('====> reading events... empty stream');
                return [];
            }
            console.log('====> reading events... ', JSON.stringify(error, null, 4));
            throw error;
        }
        console.log('====> reading events... done');
        return events;
    }
    async addEvents(
        streamName: string,
        aggregateId: string,
        events: DomainEvent<string>[]
    ): Promise<void> {
        console.log('====> adding events');
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
