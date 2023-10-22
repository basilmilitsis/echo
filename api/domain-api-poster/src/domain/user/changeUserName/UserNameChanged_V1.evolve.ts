import { DomainEvent } from '@echo/lib-domain-api';
import { User } from '../User';
import { UserNameChangedData_V1 } from './UserNameChanged_V1.event';

export const evolveUserNameChanged_V1 = (aggregate: User, event: DomainEvent<string, UserNameChangedData_V1>): User => {
    throw new Error('Not implemented');
}