import { EventStream, EvaluateIndexRule } from "@echo/lib-domain-api";
import { ArchivePost } from "@root/domain/post/archivePost/ArchivePost.update.command";

export const postMustExist: EvaluateIndexRule<ArchivePost> = async (command: ArchivePost, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('post', command.id);
    if(streamEvents.length === 0) {
        return ['Post not found'];
    }
    return [];
}   