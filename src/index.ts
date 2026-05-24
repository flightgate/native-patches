#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';
import { applyCommand } from './commands/apply';
import { generateCommand } from './commands/generate';
import { initCommand } from './commands/init';
import { resetCommand } from './commands/reset';
import { xcodeAddCommand } from './commands/xcode-add';
import { config } from './helpers/config';

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
  .option('--debug', 'Show all command output')
  .action(async (options) => {
    config.debug = Boolean(options.debug);
    await initCommand(options.target, options.clean);
  });

program
  .command('generate')
  .alias('g')
  .description('Create patches from changes')
  .requiredOption('-n, --name <name>', 'Patch name')
  .option('-t, --target <type>', 'Target platform', 'all')
  .option('--debug', 'Show all command output')
  .action((options) => {
    config.debug = Boolean(options.debug);
    generateCommand(options.target, options.name);
  });

program
  .command('apply')
  .alias('a')
  .description('Apply patches to android/ios')
  .option('-t, --target <type>', 'Target platform', 'all')
  .option('--debug', 'Show all command output')
  .action((options) => {
    config.debug = Boolean(options.debug);
    applyCommand(options.target);
  });

program
  .command('reset')
  .alias('r')
  .description('Remove git repositories')
  .option('-t, --target <type>', 'Target platform', 'all')
  .option('--debug', 'Show all command output')
  .action((options) => {
    config.debug = Boolean(options.debug);
    resetCommand(options.target);
  });

program
  .command('xcode-add')
  .alias('xa')
  .description('Add source files to the Xcode project (idempotent)')
  .requiredOption('-f, --file <path...>', 'File path(s) relative to ios/ directory')
  .action((options) => {
    xcodeAddCommand(options.file);
  });

program.parse();
