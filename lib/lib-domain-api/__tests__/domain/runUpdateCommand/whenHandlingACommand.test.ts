import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when handling a command', () => {
    it('should be able to raise an event', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder<{ id: string; name: string }, { id: string; name: string }>(
            raiseEvents,
            response, baseLogger
        )
            .toUpdateAggregate('post')
            .withCommand({ id: '123', name: 'bob' })
            .withExistingEventAndEvolver('post', (build) =>
                build
                    .forCreateEvent('123', 'postCreated')
                    .withSpecificCreateEvolver((event) => ({ id: '123', name: 'bob' }))
                    .final()
            )
            .withUpdateHandler((command, aggregate, metadata, context) => [{ id: '123', type: '', data: {} }])
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'ok',
        });
        expect(raiseEvents.mock.calls.length).toBe(1);
        const raiseEventAggregateName = raiseEvents.mock.calls[0][0];
        const raiseEventAggregateId = raiseEvents.mock.calls[0][1];
        const raiseEventEvents = raiseEvents.mock.calls[0][2];
        expect(raiseEventAggregateName).toEqual('post');
        expect(raiseEventAggregateId).toEqual('123');
        expect(raiseEventEvents).toEqual([
            {
                id: '',
                type: '',
                aggregateId: '123',
                data: {},
                meta: {
                    correlationId: '',
                },
            },
        ]);
    });
});
