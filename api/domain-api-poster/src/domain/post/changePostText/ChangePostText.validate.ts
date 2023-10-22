import { ValidateCommand } from "@echo/lib-domain-api";
import { ChangePostText } from './ChangePostText.update.command';

export const validateChangePostText: ValidateCommand<ChangePostText> = (command: ChangePostText): string[] => {
    return [];
} 