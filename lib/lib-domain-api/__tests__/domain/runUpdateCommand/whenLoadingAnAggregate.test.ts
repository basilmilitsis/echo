import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when loading an aggregate', () => {
    it('should be able to use all evolver types', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        type TestAggregate = { id: string; sequence: string[] };

        let loadedAggregate: TestAggregate | undefined = undefined;
        const input = createHandleRequestInputBuilder<{ id: string }, TestAggregate>(raiseEvents, response, baseLogger)
            .toUpdateAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) =>
                build
                    .forCreateEvent('123', 'postCreated')
                    .withSpecificCreateEvolver((event) => ({ id: '123', sequence: ['a'] }))
                    .final()
            )
            .withExistingEventAndEvolver('post', (build) =>
                build
                    .forUpsertEvent('123', 'postUpserted')
                    .withSpecificUpsertEvolver((aggregate, event) => ({
                        id: '123',
                        sequence: aggregate?.sequence.concat('b') || ['ERROR'],
                    }))
                    .final()
            )
            .withExistingEventAndEvolver('post', (build) =>
                build
                    .forUpdateEvent('123', 'postUpdated')
                    .withSpecificUpdateEvolver((aggregate, event) => ({
                        id: '123',
                        sequence: aggregate.sequence.concat('c') || ['ERROR'],
                    }))
                    .final()
            )
            .withJwt()
            .withValidator((command) => [])
            .withUpdateHandler((command, aggregate, metadata, context) => {
                console.log(aggregate);
                loadedAggregate = aggregate;
                return [];
            })
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(loadedAggregate).toEqual({
            id: '123',
            sequence: ['a', 'b', 'c'],
        });
    });

    it('should return an API error a create or upsert event is not first in the stream', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        type TestAggregate = { id: string; sequence: string[] };

        let loadedAggregate: TestAggregate | undefined = undefined;
        const input = createHandleRequestInputBuilder<{ id: string }, TestAggregate>(raiseEvents, response, baseLogger)
            .toUpdateAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) =>
                build
                    .forUpdateEvent('123', 'postUpdated')
                    .withSpecificUpdateEvolver((aggregate, event) => ({
                        id: '123',
                        sequence: aggregate.sequence.concat('c') || ['ERROR'],
                    }))
                    .final()
            )
            .withJwt()
            .withValidator((command) => [])
            .withUpdateHandler((command, aggregate, metadata, context) => {
                console.log(aggregate);
                loadedAggregate = aggregate;
                return [];
            })
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'Error',
            messages: ['Interpret Error... TBD'],
        });

        const lastErrorLog = baseLogger.errorMessages[0];
        expect(lastErrorLog.message).toEqual('Error');
        expect(lastErrorLog.error.message).toEqual('Aggregate Load Error: No state after create & upsert events');        
    });

    it('should return an API Error if there is more than one create event in the stream', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        type TestAggregate = { id: string; sequence: string[] };

        let loadedAggregate: TestAggregate | undefined = undefined;
        const input = createHandleRequestInputBuilder<{ id: string }, TestAggregate>(raiseEvents, response, baseLogger)
            .toUpdateAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) => build.forCreateEvent('123', 'postCreated').final())
            .withExistingEventAndEvolver('post', (build) => build.forCreateEvent('123', 'postCreated').final())
            .withJwt()
            .withValidator((command) => [])
            .withUpdateHandler((command, aggregate, metadata, context) => {
                console.log(aggregate);
                loadedAggregate = aggregate;
                return [];
            })
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'Error',
            messages: ['Interpret Error... TBD'],
        });

        const lastErrorLog = baseLogger.errorMessages[0];
        expect(lastErrorLog.message).toEqual('Error');
        expect(lastErrorLog.error.message).toEqual('Aggregate Load Error: create event found after aggregate created');
    });

    it('should return an API error when there is no evolver for an Update event', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        type TestAggregate = { id: string; sequence: string[] };

        let loadedAggregate: TestAggregate | undefined = undefined;
        const input = createHandleRequestInputBuilder<{ id: string }, TestAggregate>(raiseEvents, response, baseLogger)
            .toUpdateAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) => build.forCreateEvent('123', 'postCreated').final())
            .withExistingEventAndEvolver('post', (build) =>
                build.forUpdateEvent('123', 'postUpdated').withNoUpdateEvolver().final()
            )
            .withJwt()
            .withValidator((command) => [])
            .withUpdateHandler((command, aggregate, metadata, context) => {
                console.log(aggregate);
                loadedAggregate = aggregate;
                return [];
            })
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'Error',
            messages: ['Interpret Error... TBD'],
        });

        const lastErrorLog = baseLogger.errorMessages[0];
        expect(lastErrorLog.message).toEqual('Error');
        expect(lastErrorLog.error.message).toEqual(
            'Aggregate Load Error: Unknown event found. AggregateName: [post], AggregateId: [123], EventId: [1], EventType: [postUpdated]'
        );
    });

    it('should return an API error when there is no evolver for an Upsert event', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        type TestAggregate = { id: string; sequence: string[] };

        let loadedAggregate: TestAggregate | undefined = undefined;
        const input = createHandleRequestInputBuilder<{ id: string }, TestAggregate>(raiseEvents, response, baseLogger)
            .toUpdateAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) => build.forCreateEvent('123', 'postCreated').final())
            .withExistingEventAndEvolver('post', (build) =>
                build.forUpsertEvent('123', 'postUpdated').withNoUpsertEvolver().final()
            )
            .withJwt()
            .withValidator((command) => [])
            .withUpdateHandler((command, aggregate, metadata, context) => {
                console.log(aggregate);
                loadedAggregate = aggregate;
                return [];
            })
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'Error',
            messages: ['Interpret Error... TBD'],
        });

        const lastErrorLog = baseLogger.errorMessages[0];
        expect(lastErrorLog.message).toEqual('Error');
        expect(lastErrorLog.error.message).toEqual(
            'Aggregate Load Error: Unknown event found. AggregateName: [post], AggregateId: [123], EventId: [1], EventType: [postUpdated]'
        );
    });
});
