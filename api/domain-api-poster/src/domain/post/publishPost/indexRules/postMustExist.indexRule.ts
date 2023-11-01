import { EventStream, EvaluateCommandIndexRule } from "@echo/lib-domain-api";
import { PublishPost } from "@root/domain/post/publishPost/PublishPost.update.command";

export const postMustExist: EvaluateCommandIndexRule<PublishPost> = async (command: PublishPost, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('Post', command.id);
    if(streamEvents.length === 0) {
        return ['Post not found'];
    }
    return [];
}   