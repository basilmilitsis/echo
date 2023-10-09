import path from 'node:path';
import * as voca from 'voca';
import fs from 'fs';

import commander from 'commander';
import { api_domain } from './sub-commands/domain/api_domain';
import { api_rest } from './sub-commands/rest/api_rest';
import { PathRules, Template } from '@root/common';
import { PathTo } from './common';

type RushFile = {
    projects: {packageName: string, projectFolder: string}[]
}

export const api = new commander.Command('api');
api.command('create')
    .argument('apiName')
    .argument('apiPort')
    .action((apiName, apiPort) => {

        PathRules.ensureCurrentlyInSolutionRoot();

        const projectPath = path.join(process.env.PWD, 'api', voca.kebabCase(apiName));

        //-- write files in "./api/<apiName>/" folder
        Template.makeFolder(projectPath);

        Template.write(
            PathTo.eslintFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/.eslintrc.json.ejs`),
            {}
        );
        Template.write(
            PathTo.gitignoreFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/.gitignore.ejs`),
            {}
        );
        Template.write(
            PathTo.prettierrcFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/.prettierrc.json.ejs`),
            {}
        );
        Template.write(
            PathTo.jestFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/jest.config.js.ejs`),
            {}
        );
        Template.write(
            PathTo.jestEnvFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/jest.env.js.ejs`),
            {}
        );
        Template.write(
            PathTo.packageFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/package.json.ejs`),
            {
                apiName: apiName
            }
        );
        Template.write(
            PathTo.envFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/.env.ejs`),
            {
                apiPort: apiPort
            }
        );
        Template.write(
            PathTo.tsconfigFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/tsconfig.json.ejs`),
            {}
        );
        Template.write(
            PathTo.tsconfigTestFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/tsconfig.test.json.ejs`),
            {}
        );
            
        //-- write files in "./api/<apiName>/src" folder
        Template.makeFolder(PathTo.srcFolder(projectPath));

        Template.write(
            PathTo.indexFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/src/index.ts.ejs`),
            {}
        );

        //-- write files in "./api/<apiName>/src/domain" folder
        Template.makeFolder(PathTo.domainFolder(projectPath));

        Template.write(
            PathTo.domainGitkeepFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/src/domain/.gitkeep.ejs`),
            {}
        );

        //-- write files in "./api/<apiName>/src/_generated" folder
        Template.makeFolder(PathTo.generatedFolder(projectPath));

        Template.write(
            PathTo.domainGitkeepFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/src/_generated/restAPI.generated.ts.ejs`),
            {}
        );

        //-- update rush.json file with new project
        const rushFile: RushFile = JSON.parse(fs.readFileSync('rush.json', 'utf8'));
        if(!rushFile.projects.find(x => x.packageName === apiName)) {
            rushFile.projects.push({
                packageName: apiName,
                projectFolder: `api/${apiName}`
            });
            fs.writeFileSync('rush.json', JSON.stringify(rushFile, null, 2));    
        }
    });
api.addCommand(api_domain).addCommand(api_rest);
