import { LoadEnvironmentVariableError } from './errors';

export class BaseEnvironment {
    static readonly production: boolean = process.env.PRODUCTION === 'true';

    protected static parseInt = (valueAsString: string | undefined, defaultValue?: number): number => {
        if (!defaultValue && !valueAsString) {
            throw new LoadEnvironmentVariableError('Default value required if no value provided');
        }
        if (defaultValue && !valueAsString) {
            return defaultValue;
        }
        if (!valueAsString) {
            throw new LoadEnvironmentVariableError('No value provided');
        }

        try {
            return parseInt(valueAsString);
        } catch (error) {
            throw new LoadEnvironmentVariableError(`Cannot parse value as integer: [${valueAsString}]`);
        }
    };
}
