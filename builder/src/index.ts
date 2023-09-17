import 'source-map-support/register';

import { Command } from 'commander';
import { subCommand_command } from './command';
import { subCommand_event } from './event';
import { subCommand_query } from './query';
import { subCommand_domain } from './domain';
import { subCommand_apiRest } from './api-rest';

const program = new Command();

program.name('domain-builder').description('CLI to build domain objects').version('0.0.0');

program.addCommand(subCommand_command());
program.addCommand(subCommand_event());
program.addCommand(subCommand_query());
program.addCommand(subCommand_domain());
program.addCommand(subCommand_apiRest());

program.parse();
