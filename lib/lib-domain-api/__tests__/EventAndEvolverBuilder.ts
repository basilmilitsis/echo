import {
    Aggregate,
    AggregateCreateEventEvolver,
    AggregateUpdateEventEvolver,
    AggregateUpsertEventEvolver,
    CommandEventData,
    DomainEvent,
    DomainEventMetadata,
} from '@root/domain';

export interface BaseEventAndEvolverBuilder<
    ED extends CommandEventData,
    DE extends DomainEvent<string, ED>,
    A extends Aggregate,
> {
    forCreateEvent(aggregateId: string, eventType: string): CreateEventAndEvolverBuilder<ED, DE, A>;
    forUpdateEvent(aggregateId: string, eventType: string): UpdateEventAndEvolverBuilder<ED, DE, A>;
    forUpsertEvent(aggregateId: string, eventType: string): UpsertEventAndEvolverBuilder<ED, DE, A>;
}

interface CreateEventAndEvolverBuilder<
    ED extends CommandEventData,
    DE extends DomainEvent<string, ED>,
    A extends Aggregate,
> {
    withSpecificData(data: ED): CreateEventAndEvolverBuilder<ED, DE, A>;
    withSpecificMetadata(metadata: DomainEventMetadata): CreateEventAndEvolverBuilder<ED, DE, A>;
    withSpecificCreateEvolver(evolver: AggregateCreateEventEvolver<A>): CreateEventAndEvolverBuilder<ED, DE, A>;
    withNoCreateEvolver(): CreateEventAndEvolverBuilder<ED, DE, A>;
    final(): FinalEventAndEvolverBuilder<ED, DE, A>;
}

interface UpdateEventAndEvolverBuilder<
    ED extends CommandEventData,
    DE extends DomainEvent<string, ED>,
    A extends Aggregate,
> {
    withSpecificData(data: ED): UpdateEventAndEvolverBuilder<ED, DE, A>;
    withSpecificMetadata(metadata: DomainEventMetadata): UpdateEventAndEvolverBuilder<ED, DE, A>;
    withSpecificUpdateEvolver(evolver: AggregateUpdateEventEvolver<A>): UpdateEventAndEvolverBuilder<ED, DE, A>;
    withNoUpdateEvolver(): UpdateEventAndEvolverBuilder<ED, DE, A>;
    final(): FinalEventAndEvolverBuilder<ED, DE, A>;
}

interface UpsertEventAndEvolverBuilder<
    ED extends CommandEventData,
    DE extends DomainEvent<string, ED>,
    A extends Aggregate,
> {
    withSpecificData(data: ED): UpsertEventAndEvolverBuilder<ED, DE, A>;
    withSpecificMetadata(metadata: DomainEventMetadata): UpsertEventAndEvolverBuilder<ED, DE, A>;
    withSpecificUpsertEvolver(evolver: AggregateUpsertEventEvolver<A>): UpsertEventAndEvolverBuilder<ED, DE, A>;
    withNoUpsertEvolver(): UpsertEventAndEvolverBuilder<ED, DE, A>;
    final(): FinalEventAndEvolverBuilder<ED, DE, A>;
}

export interface FinalEventAndEvolverBuilder<
    ED extends CommandEventData,
    DE extends DomainEvent<string, ED>,
    A extends Aggregate,
> {
    buildEvent(): DE;
    getEventKind(): 'create' | 'update' | 'upsert';
    buildCreateEvolver(): AggregateCreateEventEvolver<A> | undefined;
    buildUpdateEvolver(): AggregateUpdateEventEvolver<A> | undefined;
    buildUpsertEvolver(): AggregateUpsertEventEvolver<A> | undefined;
}

class EventAndEvolverBuilder<
        ED extends CommandEventData,
        DE extends DomainEvent<string, ED>,
        A extends Aggregate,
    >
    implements
        BaseEventAndEvolverBuilder<ED, DE, A>,
        CreateEventAndEvolverBuilder<ED, DE, A>,
        UpdateEventAndEvolverBuilder<ED, DE, A>,
        UpsertEventAndEvolverBuilder<ED, DE, A>,
        FinalEventAndEvolverBuilder<ED, DE, A>
{
    private _kind: 'create' | 'update' | 'upsert' | undefined = undefined;
    private _aggregateId: string | undefined;
    private _eventId: string | undefined;
    private _eventType: string | undefined;
    private _data: {} | undefined;
    private _metadata: DomainEventMetadata | undefined;

    private _createEvolver: AggregateCreateEventEvolver<A> | undefined = ((event: DE) => ({ id: '123' }) as A) as any; // TODO: improve typing;
    private _updateEvolver: AggregateUpdateEventEvolver<A> | undefined = ((event: DE) => ({ id: '123' }) as A) as any; // TODO: improve typing
    private _upsertEvolver: AggregateUpsertEventEvolver<A> | undefined = ((event: DE) => ({ id: '123' }) as A) as any; // TODO: improve typing

    constructor(index: number) {
        this._eventId = index.toString();
    }

    forCreateEvent(aggregateId: string, eventType: string): CreateEventAndEvolverBuilder<ED, DE, A> {
        this._kind = 'create';
        this._aggregateId = aggregateId;
        this._eventType = eventType;
        return this;
    }
    forUpdateEvent(aggregateId: string, eventType: string): UpdateEventAndEvolverBuilder<ED, DE, A> {
        this._kind = 'update';
        this._aggregateId = aggregateId;
        this._eventType = eventType;
        return this;
    }
    forUpsertEvent(aggregateId: string, eventType: string): UpsertEventAndEvolverBuilder<ED, DE, A> {
        this._kind = 'upsert';
        this._aggregateId = aggregateId;
        this._eventType = eventType;
        return this;
    }
    withSpecificData(data: ED) {
        this._data = data;
        return this;
    }
    withSpecificMetadata(metadata: DomainEventMetadata) {
        this._metadata = metadata;
        return this;
    }
    withSpecificCreateEvolver(evolver: AggregateCreateEventEvolver<A>) {
        this._createEvolver = evolver;
        return this;
    }
    withSpecificUpdateEvolver(evolver: AggregateUpdateEventEvolver<A>): UpdateEventAndEvolverBuilder<ED, DE, A> {
        this._updateEvolver = evolver;
        return this;
    }
    withSpecificUpsertEvolver(evolver: AggregateUpsertEventEvolver<A>): UpsertEventAndEvolverBuilder<ED, DE, A> {
        this._upsertEvolver = evolver;
        return this;
    }
    withNoCreateEvolver() {
        this._createEvolver = undefined;
        return this;
    }
    withNoUpdateEvolver(): UpdateEventAndEvolverBuilder<ED, DE, A> {
        this._updateEvolver = undefined;
        return this;
    }
    withNoUpsertEvolver(): UpsertEventAndEvolverBuilder<ED, DE, A> {
        this._upsertEvolver = undefined;
        return this;
    }
    final(): FinalEventAndEvolverBuilder<ED, DE, A> {
        return this;
    }

    buildEvent(): DE {
        if (!this._aggregateId) {
            throw new Error('aggregateId not set');
        }
        if (!this._eventId) {
            throw new Error('eventId not set');
        }
        if (!this._eventType) {
            throw new Error('eventType not set');
        }
        return {
            aggregateId: this._aggregateId,
            id: this._eventId,
            type: this._eventType,
            data: this._data || {
                name: 'bob',
            },
            meta: this._metadata || {
                correlationId: 'xyz',
            },
        } as DE; // TODO: improve typing
    }
    getEventKind(): 'create' | 'update' | 'upsert' {
        if (!this._kind) {
            throw new Error('kind not set');
        }
        return this._kind;
    }
    buildCreateEvolver(): AggregateCreateEventEvolver<A> | undefined {
        return this._createEvolver;
    }
    buildUpdateEvolver(): AggregateUpdateEventEvolver<A> | undefined {
        return this._updateEvolver;
    }
    buildUpsertEvolver(): AggregateUpsertEventEvolver<A> | undefined {
        return this._upsertEvolver;
    }
}

export const createEventAndEvolverBuilder = <
    ED extends CommandEventData,
    DE extends DomainEvent<string, ED>,
    A extends Aggregate,
>(
    index: number
): BaseEventAndEvolverBuilder<ED, DE, A> => new EventAndEvolverBuilder<ED, DE, A>(index);
