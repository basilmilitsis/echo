import { CommandContext, CommandEvent, CommandMetadata, HandleUpdateCommand } from '@echo/lib-domain-api';
import { ChangePostText } from './ChangePostText.update.command';
import { Post } from '../Post';

export const handleChangePostText: HandleUpdateCommand<ChangePostText, Post> = (
    command: ChangePostText,
    aggregate: Post,
    metadata: CommandMetadata,
    context: CommandContext,
): CommandEvent[] => {
    return [];
};
