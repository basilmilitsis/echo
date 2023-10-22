import { EventStream, CommandIndexRule } from "@echo/lib-domain-api";
import { ChangePostText } from "@root/domain/post/changePostText/ChangePostText.update.command";

export const postMustExist: CommandIndexRule<ChangePostText> = async (command: ChangePostText, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('Post', command.id);
    if(streamEvents.length === 0) {
        return ['Post not found'];
    }
    return [];
}   