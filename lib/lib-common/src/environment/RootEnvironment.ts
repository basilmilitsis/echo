import { BaseEnvironment } from './BaseEnvironment';

export class RootEnvironment extends BaseEnvironment {
    static readonly production: boolean = RootEnvironment.parseBoolean('PRODUCTION');

    static readonly logToHost: string = RootEnvironment.parseString('LOG_TO_HOST');
    static readonly logToPort: number = RootEnvironment.parseInt('LOG_TO_PORT');
}
