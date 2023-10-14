import commander from 'commander';
import { BuilderEnvironment, PathRules, Writer } from '@root/common';
import { introspectDomain } from '@root/api/common';
import { buildModel_restApi } from './templates/rest-api/rest.api.schema.generated.ts.js';
import { buildModel_restSchema } from './templates/rest-schema/rest.schema.generated.json.js';

export const api_rest = new commander.Command('rest');
api_rest.command('generate-schema').action(() => {
    PathRules.ensureCurrentlyInProjectRoot();
    new Writer(BuilderEnvironment.pwd)
        .title('Generating: rest.schema.generated.json')
        .existingFolder('src', (folder) => {
            folder.ensureFolder('_generated', (folder) => {
                folder.ensureTemplateFile(
                    'rest.schema.generated.json',
                    `${__dirname}/templates/rest-schema/rest.schema.generated.json.ejs`,
                    buildModel_restSchema(BuilderEnvironment.pwd, introspectDomain(BuilderEnvironment.pwd))
                );
            });
        })
        .close();
});

api_rest.command('generate-api').action(() => {
    PathRules.ensureCurrentlyInProjectRoot();
    new Writer(BuilderEnvironment.pwd)
        .title('Generating: rest.api.generated.ts')
        .existingFolder('src', (folder) => {
            folder.ensureFolder('_generated', (folder) => {
                folder.ensureTemplateFile(
                    'rest.api.generated.ts',
                    `${__dirname}/templates/rest-api/rest.api.generated.ts.ejs`,
                    buildModel_restApi(BuilderEnvironment.pwd)
                );
            });
        })
        .close();
});
