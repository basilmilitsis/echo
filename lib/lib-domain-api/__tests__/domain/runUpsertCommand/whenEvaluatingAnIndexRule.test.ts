import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when evaluating an index rule', () => {
    it('should have access to the command and the ability to query other event streams', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder<{ id: string; userId: string }, { id: string }>(
            raiseEvents,
            response, baseLogger
        )
            .toUpsertAggregate('post')
            .withCommand({ id: '123', userId: 'abc' })
            .withExistingEventAndEvolver('post', (build) => build.forUpsertEvent('123', 'postCreated').final())
            .withOtherExistingAggregateStream('user', 'abc')
            .withIndexRules([
                async (command, eventStream) => {
                    const stream = await eventStream.findEvents('user', command.userId);
                    if (stream) {
                        return Promise.resolve([]);
                    }
                    return Promise.resolve(['Command index rule failed']);
                },
            ])
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
            .toUpsertAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) => build.forUpsertEvent('123', 'postCreated').final())
            .withUpsertHandler((command, aggregate, metadata, context) => [{ id: '123', type: '', data: {} }])
            .withIndexRules([(command, eventStream) => Promise.resolve(['Command index rule failed'])])
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'CommandIndexRuleError',
            messages: ['Command index rule failed'],
        });
        expect(raiseEvents.mock.calls.length).toBe(0);
    });
});
