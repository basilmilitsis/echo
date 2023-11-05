import { EventStream, EvaluateCommandIndexRule } from "@echo/lib-domain-api";
import { ChangePostText } from "@root/domain/post/changePostText/ChangePostText.update.command";

export const postMustExist: EvaluateCommandIndexRule<ChangePostText> = async (command: ChangePostText, eventStream: EventStream): Promise<string[]> => {
    const streamEvents = await eventStream.findEvents('post', command.id);
    if(streamEvents.length === 0) {
        return ['Post not found'];
    }
    return [];
}   