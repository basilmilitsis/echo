import * as fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import commander from 'commander';
import { ensureCurrentlyInProjectRoot, listFoldersIn, loadTemplate } from '@root/common';
import { buildAggregateCommandModels } from './herlpers/buildAggregateCommandModels';
import { OperationModel } from './herlpers/OperationModel';
import { PathTo } from '../../common/PathTo';

export const addToSubCommand_generateSchema = (command: commander.Command): void => {
    command
        .command('generate-schema')
        .description('generate domain file(s)')
        .action((options) => {
            ensureCurrentlyInProjectRoot();

            let operationModels: OperationModel[] = [];

            const aggregates = listFoldersIn(PathTo.domainFolder());
            aggregates.forEach((aggregate) => {
                const commands = listFoldersIn(PathTo.aggregateFolder(aggregate)).filter((x) => !x.startsWith('_'));
                operationModels = operationModels.concat(buildAggregateCommandModels(commands, aggregate));
            });

            const outputFolder = path.join(process.env.PWD, `${PathTo.srcFolder()}/_generated`);
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder);
            }

            //-- create template model
            const model = {
                operations: operationModels.map((com) => ({
                    apiName: com.apiName,
                    apiMethod: com.apiMethod,
                    operationId: com.operationId,
                    input: com.input,
                })),
            };

            //-- render template
            fs.writeFileSync(
                `${outputFolder}/schema.json`,
                ejs.render(loadTemplate(__dirname, `./templates/schema.json.ejs`), model)
            );
        });
};
