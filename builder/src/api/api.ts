import * as voca from 'voca';
import commander from 'commander';
import { api_domain } from './sub-commands/domain/api_domain';
import { api_rest } from './sub-commands/rest/api_rest';
import { Writer, PathRules } from '@root/common';

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

        // validate port is within acceptable range
        const apiPortAsInt = Number.parseInt(apiPort);
        if (apiPortAsInt < 4000 || apiPortAsInt > 4099) {
            throw new Error(`apiPort must be between 4000 and 4099`);
        }
        const apiDebuggerPort = apiPortAsInt + 500;

        new Writer(process.env.PWD)
            .title(`Creating new API '${apiName}' on port: ${apiPort}`)
            .updateJsonFile('.code-workspace', (workspaceFile: CodeWorkspaceFile) => {
                if (!workspaceFile.folders.find((x) => x.name === `🌐api/${apiName}`)) {
                    workspaceFile.folders.push({
                        name: `🌐api/${apiName}`,
                        path: `api/${apiName}`,
                    });
                }
                return workspaceFile;
            })
            .updateJsonFile('rush.json', (rushFile: RushFile) => {
                if (!rushFile.projects.find((x) => x.packageName === apiName)) {
                    rushFile.projects.push({
                        packageName: apiName,
                        projectFolder: `api/${apiName}`,
                    });
                }
                return rushFile;
            })
            .ensureFolder('common', (folder) => {
                folder.ensureFolder('config', (folder) => {
                    folder.ensureFolder('rush', (folder) => {
                        folder.updateJsonFile('deploy.json', (deployFile: DeployFile) => {
                            if (!deployFile.projectSettings.find((x) => x.projectName === apiName)) {
                                deployFile.projectSettings.push({
                                    projectName: apiName,
                                    additionalProjectsToInclude: [],
                                    additionalDependenciesToInclude: [],
                                    dependenciesToExclude: ['@types/*'],
                                    patternsToInclude: ['.dist/**', 'package.json'],
                                });
                            }
                            return deployFile;
                        });
                    });
                });
            })
            .ensureFolder('stack', (folder) => {
                folder.ensureFolder('api', (folder) => {
                    folder.updateYamlFile('docker-compose.yml', (dockerComposeFile: DockerComposeFile) => {
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
                        }
                        return dockerComposeFile;
                    });
                });
            })
            .ensureFolder(`api/${voca.kebabCase(apiName)}`, (folder) =>
                folder
                    .createTemplateFile('.gitignore', `${__dirname}/templates/create/.gitignore.ejs`, {})
                    .createTemplateFile('.env', `${__dirname}/templates/create/.env.ejs`, { apiPort: apiPort })
                    .createTemplateFile('.eslintrc.json', `${__dirname}/templates/create/.eslintrc.json.ejs`, {})
                    .createTemplateFile('.jest.config.js', `${__dirname}/templates/create/jest.config.js.ejs`, {})
                    .createTemplateFile('.jest.env.js', `${__dirname}/templates/create/jest.env.js.ejs`, {})
                    .createTemplateFile('.prettierrc.json', `${__dirname}/templates/create/.prettierrc.json.ejs`, {})
                    .createTemplateFile('dockerfile', `${__dirname}/templates/create/dockerfile.ejs`, {
                        apiName: apiName,
                    })
                    .createTemplateFile('package.json', `${__dirname}/templates/create/package.json.ejs`, {
                        apiName: apiName,
                    })
                    .createTemplateFile('tsconfig.json', `${__dirname}/templates/create/tsconfig.json.ejs`, {})
                    .createTemplateFile(
                        'tsconfig.test.json',
                        `${__dirname}/templates/create/tsconfig.test.json.ejs`,
                        {}
                    )
                    .ensureFolder('.vscode', (folder) =>
                        folder
                            .createTemplateFile(
                                'tasks.json',
                                `${__dirname}/templates/create/.vscode/tasks.json.ejs`,
                                {}
                            )
                            .createTemplateFile(
                                'launch.json',
                                `${__dirname}/templates/create/.vscode/launch.json.ejs`,
                                {
                                    apiName: apiName,
                                    apiDebuggerPort: apiDebuggerPort,
                                }
                            )
                    )
                    .ensureFolder('src', (folder) =>
                        folder
                            .createTemplateFile('index.ts', `${__dirname}/templates/create/src/index.ts.ejs`, {})
                            .ensureFolder('domain', (content) =>
                                content.createTemplateFile(
                                    '.gitkeep',
                                    `${__dirname}/templates/create/src/domain/.gitkeep.ejs`,
                                    {}
                                )
                            )
                            .ensureFolder('_generated', (folder) =>
                                folder.createTemplateFile(
                                    'rest.api.generated.ts',
                                    `${__dirname}/templates/create/src/_generated/rest.api.generated.ts.ejs`,
                                    {}
                                )
                            )
                    )
            )
            .close();
    });
api.addCommand(api_domain).addCommand(api_rest);
