import { LoadEnvironmentVariableError } from '@root/errors';

export class BaseEnvironment {

    protected static parseInt = (envVarName: string, defaultValue?: number): number => {
        const valueAsString = process.env[envVarName];
        if (!defaultValue && !valueAsString) {
            throw new LoadEnvironmentVariableError(`process.env.${envVarName}: Default value required if no value provided`);
        }
        if (defaultValue && !valueAsString) {
            return defaultValue;
        }
        if (!valueAsString) {
            throw new LoadEnvironmentVariableError(`process.env.${envVarName}: No value provided`);
        }

        try {
            return parseInt(valueAsString);
        } catch (error) {
            throw new LoadEnvironmentVariableError(`process.env.${envVarName}: Cannot parse value as integer [${valueAsString}]`);
        }
    };
    protected static parseString = (envVarName: string, defaultValue?: string): string => {
        const valueAsString = process.env[envVarName];
        if (!defaultValue && !valueAsString) {
            throw new LoadEnvironmentVariableError(`process.env.${envVarName}: Default value required if no value provided`);
        }
        if (defaultValue && !valueAsString) {
            return defaultValue;
        }
        if (!valueAsString) {
            throw new LoadEnvironmentVariableError(`process.env.${envVarName}: No value provided`);
        }

        return valueAsString;
    };
    protected static parseBoolean = (envVarName: string, defaultValue?: boolean): boolean => {
        const valueAsString = process.env[envVarName];
        if (!defaultValue && !valueAsString) {
            throw new LoadEnvironmentVariableError(`process.env.${envVarName}: Default value required if no value provided`);
        }
        if (defaultValue && !valueAsString) {
            return defaultValue;
        }
        if (!valueAsString) {
            throw new LoadEnvironmentVariableError(`process.env.${envVarName}: No value provided`);
        }

        return valueAsString === 'true';
    };
}
