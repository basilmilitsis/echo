import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { Command, CommandContext, CommandMetadata, EventStream } from '@root/domain';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when a command index rule fails', () => {
    it('should return an error', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder(raiseEvents, response, baseLogger)
            .toCreateAggregate('post')
            .withCommand({ id: '123' })
            .withJwt()
            .withValidator((command: Command) => [])
            .withCreateHandler((command: Command, metadata: CommandMetadata, context: CommandContext) => [
                { id: '123', type: '', data: {} },
            ])
            .withIndexRules([(command: Command, eventStream: EventStream) => Promise.resolve(['Command index rule failed'])])
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
