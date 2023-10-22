import { Command } from '@echo/lib-domain-api';

export interface ChangeUserProfileName extends Command {
    firstName: string;
    lastname: string;
}
