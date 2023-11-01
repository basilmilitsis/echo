import { EventStream, EvaluateCommandIndexRule } from "@echo/lib-domain-api";
import { UnpublishPost } from "@root/domain/post/unpublishPost/UnpublishPost.update.command";

export const postMustExist: EvaluateCommandIndexRule<UnpublishPost> = async (command: UnpublishPost, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('Post', command.id);
    if(streamEvents.length === 0) {
        return ['Post not found'];
    }
    return [];
}   