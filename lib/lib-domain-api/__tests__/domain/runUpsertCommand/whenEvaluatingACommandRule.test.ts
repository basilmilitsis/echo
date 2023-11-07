import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when evaluating a command rule', () => {
    it('should have access to the command', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder<{ id: string; name: string }, { id: string }>(
            raiseEvents,
            response, baseLogger
        )
            .toUpsertAggregate('post')
            .withCommand({ id: '123', name: 'bob' })
            .withExistingEventAndEvolver('post', (build) => build.forUpsertEvent('123', 'postCreated').final())
            .withCommandRules([
                (command) => {
                    if (command.name !== 'bob') {
                        return ['Command rule failed'];
                    }
                    return [];
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
            .withCommandRules([(command) => ['Command rule failed']])
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'CommandRuleError',
            messages: ['Command rule failed'],
        });
        expect(raiseEvents.mock.calls.length).toBe(0);
    });
});
