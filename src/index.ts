#!/usr/bin/env node
import { Command } from 'commander';
import { applyCommand } from './commands/apply';
import { generateCommand } from './commands/generate';
import { initCommand } from './commands/init';
import { resetCommand } from './commands/reset';
import { version } from '../package.json';

const program = new Command();

program
  .name('native-patches')
  .description('CLI tool to manage native patches for Expo projects')
  .version(version);

program
  .command('init')
  .alias('i')
  .description('Initialize git repositories in android/ios folders')
  .option('-t, --target <type>', 'Target platform', 'all')
  .option('--clean', 'Clean rebuild')
  .action(async (options) => {
    await initCommand(options.target, options.clean);
  });

program
  .command('generate')
  .alias('g')
  .description('Create patches from changes')
  .requiredOption('-n, --name <name>', 'Patch name')
  .option('-t, --target <type>', 'Target platform', 'all')
  .action((options) => {
    generateCommand(options.target, options.name);
  });

program
  .command('apply')
  .alias('a')
  .description('Apply patches to android/ios')
  .option('-t, --target <type>', 'Target platform', 'all')
  .action((options) => {
    applyCommand(options.target);
  });

program
  .command('reset')
  .alias('r')
  .description('Remove git repositories')
  .option('-t, --target <type>', 'Target platform', 'all')
  .action((options) => {
    resetCommand(options.target);
  });

program.parse();
