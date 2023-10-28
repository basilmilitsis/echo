import { CommandMetadata } from '@root/domain';
import { JwtToken } from '@root/jwt';

export const buildCommandMetadata = (
    generateUuid: () => string,
    jwt: JwtToken | undefined,
    requestMetadata: {} /* TODO */
): CommandMetadata => ({
    operationId: generateUuid(),
    correlationId: null,
    credentials: jwt
        ? {
              id: jwt.sub,
              firstName: jwt.firstName,
              lastName: jwt.lastName,
              email: jwt.email,
              profilePicture: jwt.profilePicture,
              roles: ['admin'], // TODO: Get roles from JWT
          }
        : null,
    customMetadata: {
        ...requestMetadata,
    },
});
