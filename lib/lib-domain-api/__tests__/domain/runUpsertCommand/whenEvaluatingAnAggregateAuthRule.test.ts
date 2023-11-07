import httpMocks from 'node-mocks-http';
import { handleRequest } from '@root/api-rest';
import { createHandleRequestInputBuilder } from '../../RunCommandBuilder';
import { MockBaseLogger } from '../../MockBaseLogger';

describe('when evaluating a command auth rule', () => {
    it('should have access to the command, aggregate and metadata', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        const input = createHandleRequestInputBuilder(raiseEvents, response, baseLogger)
            .toUpsertAggregate('post')
            .withCommand({ id: '123' })
            .withExistingEventAndEvolver('post', (build) => build.forUpsertEvent('123', 'postCreated').final())
            .withCustomJwt({
                sub: '123',
                email: 'bob@builder.com',
                firstName: 'Bob',
                lastName: 'Builder',
                profilePicture: undefined,
            })
            .withValidator((command) => [])
            .withUpsertHandler((command, aggregate, metadata, context) => [])
            .withUpsertAggregateAuthRules([
                (command, aggregate, metadata) => {
                    if (command.id !== aggregate?.id || command.id !== metadata.credentials?.id) {
                        return ['Command aggregate auth rule failed'];
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

    it('should receive an undefined aggregate if no aggregate exists yet', async () => {
        // assemble
        const response = httpMocks.createResponse();
        const raiseEvents = jest.fn();
        const baseLogger = new MockBaseLogger();

        let aggregatePassedToRule: any = undefined;

        const input = createHandleRequestInputBuilder(raiseEvents, response, baseLogger)
            .toUpsertAggregate('post')
            .withCommand({ id: '123' })
            .withCustomJwt({
                sub: '123',
                email: 'bob@builder.com',
                firstName: 'Bob',
                lastName: 'Builder',
                profilePicture: undefined,
            })
            .withValidator((command) => [])
            .withUpsertHandler((command, aggregate, metadata, context) => [])
            .withUpsertAggregateAuthRules([
                (command, aggregate, metadata) => {
                    aggregatePassedToRule = aggregate;
                    if (command.id !== aggregate?.id || command.id !== metadata.credentials?.id) {
                        return ['Command aggregate auth rule failed'];
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
        expect(aggregatePassedToRule).toBeUndefined();
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
            .withJwt()
            .withValidator((command) => [])
            .withUpsertHandler((command, aggregate, metadata, context) => {
                console.log(aggregate);
                return [{ id: '123', type: '', data: {} }];
            })
            .withUpsertAggregateAuthRules([(command, aggregate, metadata) => ['Command aggregate auth rule failed']])
            .build();

        // act
        await handleRequest(input);

        // assert
        expect(JSON.parse(response._getData())).toEqual({
            result: 'error',
            type: 'CommandAggregateAuthRuleError',
            messages: ['Command aggregate auth rule failed'],
        });
        expect(raiseEvents.mock.calls.length).toBe(0);
    });
});
