import { Command } from '@echo/lib-domain-api';

export interface UserUnlikesPost extends Command {
    userId: string;
}
