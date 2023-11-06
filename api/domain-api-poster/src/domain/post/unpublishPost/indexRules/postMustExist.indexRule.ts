import { EventStream, EvaluateIndexRule } from "@echo/lib-domain-api";
import { UnpublishPost } from "@root/domain/post/unpublishPost/UnpublishPost.update.command";

export const postMustExist: EvaluateIndexRule<UnpublishPost> = async (command: UnpublishPost, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('post', command.id);
    if(streamEvents.length === 0) {
        return ['Post not found'];
    }
    return [];
}   