import { DomainEvent } from '@echo/lib-domain-api';
import { User } from '../User';
import { UserRegisteredData_V1 } from './UserRegistered_V1.event';

export const evolveUserRegistered_V1 = (event: DomainEvent<string, UserRegisteredData_V1>): User => {
    throw new Error('Not implemented');
}