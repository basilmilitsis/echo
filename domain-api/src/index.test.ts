import { createPost, publishPost, archivePost } from './domain/post/_generated/Post.operations';
import { MockEventStream } from './common';
import { EventType as CreatedEventType } from './domain/post/createPost/PostCreated_V1.event';
import { EventType as PublishedEventType } from './domain/post/publishPost/PostPublished_V1.event';

// TODO: rewrite/move these tests, they are at the wrong level 


describe('pipeline works', () => {
    test('to return an event', async () => {
        const eventStream = new MockEventStream();

        await createPost(
            {
                id: '12345',
                text: 'some text',
                images: [],
            },
            {
                eventStream: eventStream,
                generateUuid: () => 'abcde',
            }
        );

        expect(await eventStream.findEvents('Post', '12345')).toEqual([
            {
                id: 'abcde',
                aggregateId: '12345',
                type: CreatedEventType.PostCreated_V1,
                data: {
                    text: 'some text',
                    images: [],
                },
                meta: {
                    correlationId: '',
                },
            },
        ]);
    });
});

describe('pipeline returns error', () => {
    test('when validation fails', async () => {
        const eventStream = new MockEventStream();

        await expect(
            createPost(
                {
                    id: '12345',
                    text: '',
                    images: [],
                },
                {
                    eventStream: eventStream,
                    generateUuid: () => 'abcde',
                }
            )
        ).rejects.toThrowError('ERROR: Validation Failed');
    });
    test('when command rule fails', async () => {
        const eventStream = new MockEventStream();

        await expect(
            createPost(
                {
                    id: '12345',
                    text: '123',
                    images: ['1', '2', '3', '4', '5', '6'],
                },
                {
                    eventStream: eventStream,
                    generateUuid: () => 'abcde',
                }
            )
        ).rejects.toThrowError('ERROR: Command Rule Failed');
    });
    test('when command INDEX rule fails', async () => {
        const eventStream = new MockEventStream();
        eventStream.addEvents('Post', '12345', [
            {
                id: 'abcde',
                aggregateId: '12345',
                type: CreatedEventType.PostCreated_V1,
                data: {
                    text: 'some text',
                    images: [],
                },
                meta: {
                    correlationId: '',
                },
            },
        ]);

        await expect(
            createPost(
                {
                    id: '12345',
                    text: '123',
                    images: [],
                },
                {
                    eventStream: eventStream,
                    generateUuid: () => 'abcde',
                }
            )
        ).rejects.toThrowError('ERROR: Command Index Rule Failed');
    });

    test('when command AGGREGATE rule fails', async () => {
        const eventStream = new MockEventStream();
        eventStream.addEvents('Post', '12345', [
            {
                id: 'abcde',
                aggregateId: '12345',
                type: CreatedEventType.PostCreated_V1,
                data: {
                    text: 'some text',
                    images: [],
                },
                meta: {
                    correlationId: '',
                },
            },           
            {
                id: 'efghij',
                aggregateId: '12345',
                type: PublishedEventType.PostPublished_V1,
                data: {
                },
                meta: {
                    correlationId: '',
                },
            },
        ]);
        await expect(
             publishPost(
                {
                    id: '12345',
                },
                {
                    eventStream: eventStream,
                    generateUuid: () => 'klmop',
                }
            )
        ).rejects.toThrowError('ERROR: Command Aggregate Rule Failed');
    });
});
