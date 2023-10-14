import { BaseEnvironment } from 'lib-common';

export class BuilderEnvironment extends BaseEnvironment {
    static pwd: string = BuilderEnvironment.parseString('PWD');
}