import { IncomingHttpHeaders } from 'http';

export const extractJwtStringFromHeader = (headers: IncomingHttpHeaders): string | undefined => {
    const jwtString = headers['authorization'];

    if (!jwtString) {
        return undefined;
    }

    return jwtString.replace('Bearer ', '');
};
