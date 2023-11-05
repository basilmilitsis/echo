import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when checking a validator', () => {
    it('should have access to the command', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder<{ id: string; name: string }, { id: string }>(
            raiseEvents,
            response, baseLogger
        )
            .toUpdateAggregate('post')
            .withCommand({ id: '123', name: 'bob' })
            .withExistingEventAndEvolver('post', (build) => build.forCreateEvent('123', 'postCreated').final())
            .withExistingEventAndEvolver('post', (build) => build.forUpdateEvent('123', 'postUpdated').final())
            .withJwt()
            .withValidator((command) => {
                if (command.name.length < 3) {
                    return ['name is too short'];
                }
                return [];
            })
            .withUpdateHandler((command, aggregate, metadata, context) => [])
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'ok',
        });
    });

    it('should fail the entire api response when returning an error', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder(raiseEvents, response, baseLogger)
            .toUpdateAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) => build.forCreateEvent('123', 'postCreated').final())
            .withExistingEventAndEvolver('post', (build) => build.forUpdateEvent('123', 'postUpdated').final())
            .withJwt()
            .withValidator((command) => ['validation error'])
            .withUpdateHandler((command, aggregate, metadata, context) => [{ id: '123', type: '', data: {} }])
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'ValidationError',
            messages: ['validation error'],
        });
        expect(raiseEvents.mock.calls.length).toBe(0);
    });
});
