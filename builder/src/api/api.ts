import path from 'node:path';
import * as voca from 'voca';

import commander from 'commander';
import { api_domain } from './sub-commands/domain/api_domain';
import { api_rest } from './sub-commands/rest/api_rest';
import { Disk, PathRules, Template } from '@root/common';
import { PathTo } from './common';

type RushFile = {
    projects: { packageName: string; projectFolder: string }[];
};
type DeployFile = {
    projectSettings: {
        projectName: string;
        additionalProjectsToInclude: string[];
        additionalDependenciesToInclude: string[];
        dependenciesToExclude: string[];
        patternsToInclude: string[];
    }[];
};
type CodeWorkspaceFile = {
    folders: { name: string; path: string }[];
};
type DockerComposeFile = Record<
    string,
    {
        image: string;
        container_name: string;
        networks: string[];
        ports: string[];
        working_dir: string;
        command: string;
        environment: Record<string, string>;
    }
>;

export const api = new commander.Command('api');
api.command('create')
    .argument('apiName')
    .argument('apiPort')
    .action((apiName, apiPort) => {
        PathRules.ensureCurrentlyInSolutionRoot();

        // validate port is withing acceptable range
        const apiPortAsInt = Number.parseInt(apiPort);
        if (apiPortAsInt < 4000 || apiPortAsInt > 4099) {
            throw new Error(`apiPort must be between 4000 and 4099`);
        }
        const apiDebuggerPort = apiPortAsInt + 500;

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
                apiName: apiName,
            }
        );
        Template.write(PathTo.envFile(projectPath), Template.templatePath(__dirname, `./templates/create/.env.ejs`), {
            apiPort: apiPort,
        });
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
        Template.write(
            PathTo.dockerfileFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/dockerfile.ejs`),
            {
                apiName: apiName
            }
        );

        //-- write files in "./api/<apiName>/.vscode" folder
        Template.makeFolder(PathTo.vscodeFolder(projectPath));
        Template.write(
            PathTo.vscodeTasksFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/.vscode/tasks.json.ejs`),
            {}
        );
        Template.write(
            PathTo.vscodeLaunchFile(projectPath),
            Template.templatePath(__dirname, `./templates/create/.vscode/launch.json.ejs`),
            {
                apiName: apiName,
                apiDebuggerPort: apiDebuggerPort,
            }
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

        //-- .code-workspace - update with new project
        const codeWorkspaceFile: CodeWorkspaceFile = Disk.readFileAsJson('.code-workspace');
        if (!codeWorkspaceFile.folders.find((x) => x.name === `🌐api/${apiName}`)) {
            codeWorkspaceFile.folders.push({
                name: `🌐api/${apiName}`,
                path: `api/${apiName}`,
            });
            Disk.writeFileJson('.code-workspace', codeWorkspaceFile);
        }

        //-- rush.json - update with new project
        const rushFile: RushFile = Disk.readFileAsJson('rush.json');
        if (!rushFile.projects.find((x) => x.packageName === apiName)) {
            rushFile.projects.push({
                packageName: apiName,
                projectFolder: `api/${apiName}`,
            });
            Disk.writeFileJson('rush.json', rushFile);
        }

        //-- ./common/config/rush/deploy.json - update with new project
        const deployFile: DeployFile = Disk.readFileAsJson('./common/config/rush/deploy.json');
        if (!deployFile.projectSettings.find((x) => x.projectName === apiName)) {
            deployFile.projectSettings.push({
                projectName: apiName,
                additionalProjectsToInclude: [],
                additionalDependenciesToInclude: [],
                dependenciesToExclude: ['@types/*'],
                patternsToInclude: ['.dist/**', 'package.json'],
            });
            Disk.writeFileJson('./common/config/rush/deploy.json', deployFile);
        }

        //-- ./stack/api/docker-compose.yml - update with new project
        const dockerComposeFile: DockerComposeFile = Disk.readFileAsYaml('./stack/api/docker-compose.yml');
        if (!dockerComposeFile.services[apiName]) {
            dockerComposeFile.services[apiName] = {
                image: `${apiName}:1.0.0`,
                container_name: apiName,
                networks: ['net'],
                ports: [`${apiPort}:${apiPort}`, `${apiDebuggerPort}:9229`],
                working_dir: `/app/api/${apiName}`,
                command: 'npm run dev:start',
                environment: {
                    PRODUCTION: false,
                    LOG_TO_HOST: 'logstash',
                    LOG_TO_PORT: 5000,
                    APIREST_API_PORT: apiPortAsInt,
                    APIREST_EVENTSTOREDB_HOST: 'eventstoredb',
                    APIREST_EVENTSTOREDB_PORT: 2113,
                },
            };
            Disk.writeFileYaml('./stack/api/docker-compose.yml', dockerComposeFile);
        }
    });
api.addCommand(api_domain).addCommand(api_rest);
