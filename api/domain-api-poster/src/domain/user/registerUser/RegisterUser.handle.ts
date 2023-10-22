import { CommandEvent, HandleCreateCommand } from '@echo/lib-domain-api';
import { RegisterUser } from './RegisterUser.create.command';

export const handleRegisterUser: HandleCreateCommand<RegisterUser> = (
    command: RegisterUser
): CommandEvent[] => {
    return [];
};
