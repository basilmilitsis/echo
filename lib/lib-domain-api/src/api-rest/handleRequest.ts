import { Response as ExpressRes } from 'express';
import { IncomingHttpHeaders } from 'http';
import { Command, CommandContext, CommandMetadata, DomainLogger, EventStream } from '@root/domain';
import { JwtToken, decodeJwt, verifyJwt } from '@root/jwt';
import { buildCommandMetadata } from './buildCommandMetadata';
import { interpretAsApiRestError } from './interpretAsApiRestError';
import { extractJwtStringFromHeader } from './extractJwtStringFromHeader';
import { BaseLogger } from '@echo/lib-common';

export type HandleRequestInput<C extends Command> = {
    requestBody: C;
    requestHeaders: IncomingHttpHeaders;
    response: ExpressRes;
    commandRunner: (command: C, context: CommandContext, metadata: CommandMetadata) => Promise<void>;
    baseLogger: BaseLogger;
    uuidv4: () => string;
    eventStream: EventStream;
};

export type CommandRestApiResult = {
    result: 'ok' | 'error';
    type?: string;
    messages?: string[];
};

export const handleRequest = async <C extends Command>(input: HandleRequestInput<C>) => {
    let domainLogger: DomainLogger;
    let commandMetadata: CommandMetadata;
    try {
        let jwt: JwtToken | undefined = undefined;
        const jwtString = extractJwtStringFromHeader(input.requestHeaders);
        if (jwtString) {
            verifyJwt(jwtString);
            jwt = decodeJwt(jwtString);
        }
        commandMetadata = buildCommandMetadata(input.uuidv4, jwt, {});
        domainLogger = new DomainLogger(input.baseLogger, commandMetadata);
    } catch (err) {
        input.baseLogger.error('Framework Error', err as Error /* TODO: make unknown */, {
            /* TODO: pass in some context */
        });
        return input.response.status(500).json({
            result: 'error',
            type: 'Error',
            messages: ['JWT Error... TBD'], // TODO:
        });
    }

    try {
        domainLogger.info(`body: ${JSON.stringify(input.requestBody, null, 4)}`);
        const context: CommandContext = {
            eventStream: input.eventStream,
            generateUuid: input.uuidv4,
            logger: domainLogger,
        };
        await input.commandRunner(input.requestBody, context, commandMetadata);
        return input.response.status(200).json({ result: 'ok' });
    } catch (err) {
        return interpretAsApiRestError(input.response, err, domainLogger);
    }
};
