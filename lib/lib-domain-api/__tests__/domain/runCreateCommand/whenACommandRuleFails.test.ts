import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { Command, CommandContext, CommandMetadata } from '@root/domain';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when a command rule fails', () => {
    it('should return an error', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder(raiseEvents, response, baseLogger)
            .toCreateAggregate('post')
            .withCommand({ id: '123' })
            .withCreateHandler((command: Command, metadata: CommandMetadata, context: CommandContext) => [
                { id: '123', type: '', data: {} },
            ])
            .withCommandRules([(command: Command) => ['Command rule failed']])
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
