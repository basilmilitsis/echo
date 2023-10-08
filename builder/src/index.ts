#!/usr/bin/env node

import 'source-map-support/register';

import commander from 'commander';
import { api } from './api/api';

const program = new commander.Command();
program.name('domain-builder').description('CLI to build domain objects').version('0.0.0');

//-- Add all commands
program.addCommand(api);
program.parse();
