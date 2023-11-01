import { UnknownParams, Context, Document } from 'openapi-backend';
import { Request as ExpressReq, Response as ExpressRes } from 'express';
import { Command, CommandContext, CommandMetadata, DomainLogger, EventStream } from '@root/domain';
import { JwtToken, decodeJwt, verifyJwt } from '@root/jwt';
import { buildCommandMetadata } from './buildCommandMetadata';
import { interpretAsApiRestError } from './interpretAsApiRestError';
import { extractJwtStringFromHeader } from './extractJwtStringFromHeader';
import { BaseLogger } from '@echo/lib-common';

export const handleRequest = async <C extends Command>(
    _c: Context<C, UnknownParams, UnknownParams, UnknownParams, UnknownParams, Document>,
    req: ExpressReq<any, C, any, any, any>,
    res: ExpressRes,
    commandRunner: (command: C, context: CommandContext, metadata: CommandMetadata) => Promise<void>,
    baseLogger: BaseLogger,
    uuidv4: () => string,
    eventStream: EventStream
) => {
    let domainLogger: DomainLogger;
    let commandMetadata: CommandMetadata;
    try {
        let jwt: JwtToken | undefined = undefined;
        const jwtString = extractJwtStringFromHeader(req.headers);
        if (jwtString) {
            verifyJwt(jwtString);
            jwt = decodeJwt(jwtString);
        }
        commandMetadata = buildCommandMetadata(uuidv4, jwt, {});
        domainLogger = new DomainLogger(baseLogger, commandMetadata);
    } catch (err) {
        baseLogger.error('Framework Error', err as Error /* TODO: make unknown */, {
            /* TODO: pass in some context */
        });
        return res.status(500).json({
            result: 'error',
            type: 'Error',
            messages: ['Error... TBD'], // TODO:
        });
    }

    try {
        domainLogger.info(`publishPost, body: ${JSON.stringify(req.body, null, 4)}`);
        const context: CommandContext = { eventStream, generateUuid: uuidv4, logger: domainLogger };
        await commandRunner(req.body, context, commandMetadata);
        return res.status(200).json({ result: 'ok' });
    } catch (err) {
        return interpretAsApiRestError(res, err, domainLogger);
    }
};
