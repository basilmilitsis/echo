import { createGenerator, Config } from 'ts-json-schema-generator';

export const operationToJsonString = (operationName: string, operationPath: string, tsConfigPath: string): string => {
    const config: Config = {
        //path: operationPath, // TODO: is this needed?
        tsconfig: tsConfigPath,
        type: operationName,
        expose: 'none',
    };
    const schema = createGenerator(config).createSchema(config.type);
    return JSON.stringify(schema.definitions[operationName], null, 4);
};
