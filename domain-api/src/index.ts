import 'source-map-support/register';
import { createPost, publishPost, archivePost } from './domain/post/_generated/Post.operations';

const doLogic = async () => {
    await createPost({
        id: '12345',
        text: 'some text',
        images: []
    })
    await publishPost({
        id: '12345',
    })
    await archivePost({
        id: '12345',
    })
}

(async () => {
    await doLogic();
})().catch(e => {
    if(e instanceof Error) console.log(`error: ${e.name}, message: ${e.message}}`);
    console.log('THREW ERROR');
});


