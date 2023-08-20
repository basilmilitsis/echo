import 'source-map-support/register';

import { v4 as uuidv4 } from 'uuid';
import { createPost, publishPost, archivePost } from './domain/post/_generated/Post.operations';
import { DefaultEventStream, EventStream } from './common';
import { CommandContext } from './common/CommandContext';

const eventStream: EventStream = new DefaultEventStream();
const context: CommandContext = {eventStream, generateUuid: uuidv4};

const doLogic = async () => {
    await createPost({
        id: '12345',
        text: 'some text',
        images: []
    }, context)
    await publishPost({
        id: '12345',
    }, context)
    await archivePost({
        id: '12345',
    }, context)
}

(async () => {
    await doLogic();
})().catch(e => {
    if(e instanceof Error) console.log(`error: ${e.name}, message: ${e.message}}`);
    console.log('THREW ERROR');
});


