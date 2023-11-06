import { EventStream, EvaluateIndexRule } from '@echo/lib-domain-api';
import { CreateUserProfile } from '@root/domain/userProfile/createUserProfile/CreateUserProfile.create.command';

export const userMustNotAlreadyExist: EvaluateIndexRule<CreateUserProfile> = async (
    command: CreateUserProfile,
    eventStream: EventStream
): Promise<string[]> => {
    if ((await eventStream.findEvents('userProfile', command.id)).length > 0) {
        return ['user already exists'];
    }
    return [];
};
