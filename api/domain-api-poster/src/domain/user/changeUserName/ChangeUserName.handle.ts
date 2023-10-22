import { CommandEvent, HandleUpdateCommand } from '@echo/lib-domain-api';
import { ChangeUserName } from './ChangeUserName.update.command';
import { User } from '../User';

export const handleChangeUserName: HandleUpdateCommand<ChangeUserName, User> = (
    command: ChangeUserName,
    aggregate: User
): CommandEvent[] => {
    return [];
};
