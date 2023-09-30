import commander from 'commander';
import { introspectDomain, PathRules, PathTo, Template } from '@root/common';
import { buildModel_restApi } from './templates/rest-api/rest.api.schema.generated.ts.js';
import { buildModel_restSchema } from './templates/rest-schema/rest.schema.json.js';

export const api_rest = new commander.Command('rest');
api_rest.command('generate-schema').action(() => {
PathRules.ensureCurrentlyInProjectRoot();

Template.write(
    PathTo.restApiSchema(process.env.PWD),
    Template.templatePath(__dirname, `./templates/rest-schema/rest.schema.json.ejs`),
    buildModel_restSchema(process.env.PWD, introspectDomain(process.env.PWD))
);
});

api_rest.command('generate-api').action(() => {
    PathRules.ensureCurrentlyInProjectRoot();
    Template.write(
        PathTo.restApiFile(process.env.PWD),
        Template.templatePath(__dirname, `./templates/rest-api/rest.api.generated.ts.ejs`),
        buildModel_restApi(process.env.PWD)
    );
});
