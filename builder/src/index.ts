import 'source-map-support/register';

import commander from 'commander';
import { api_domain } from './api/domain/api_domain';
import { api_rest } from './api/rest/api_rest';

const program = new commander.Command();
program.name('domain-builder').description('CLI to build domain objects').version('0.0.0');

//-- Api
const api = new commander.Command('api');
api.command('create')
    .argument('<name>')
    .action((options) => {});
api.addCommand(api_domain).addCommand(api_rest);

//-- Add all commands
program.addCommand(api);
program.parse();
