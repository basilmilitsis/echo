import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { Command, CommandContext, CommandMetadata } from '@root/domain';
import { createHandleRequestInputBuilder } from '../..//RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when validation fails', () => {
    it('should return an error', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder(raiseEvents, response, baseLogger)
            .toCreateAggregate('post')
            .withCommand({ id: '123' })
            .withValidator((command: Command) => ['validation error'])
            .withCreateHandler((command: Command, metadata: CommandMetadata, context: CommandContext) => [
                { id: '123', type: 'eventType', data: {} },
            ])
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
