#!/usr/bin/env node
import { Command } from 'commander';
import { handleGenerate } from './generate';
import { handleConfig } from './config';
import { handleDoctor } from './doctor';

const program = new Command();

program
  .name('di-site-builder')
  .description('Autonomous CLI to convert Figma designs into production-ready Dealer Inspire WordPress theme code.')
  .version('1.0.0');

program
  .command('generate')
  .description('Kick-off the full feedback loop to generate a WordPress theme from a Figma design.')
  .requiredOption('-u, --url <figmaNodeUrl>', 'Figma node URL')
  .requiredOption('-t, --theme <themeName>', 'Target theme name')
  .option('--max-iter <maxIter>', 'Maximum number of refinement iterations', '5')
  .action(handleGenerate);

program
  .command('config')
  .description('Store & validate configuration (Figma token, paths, etc.).')
  .option('--set <key>=<value>', 'Set a configuration key-value pair')
  .action(handleConfig);

program
  .command('doctor')
  .description('Run an environment health check.')
  .action(handleDoctor);

// Alias 'disb' to 'di-site-builder'
if (process.argv[1].endsWith('disb')) {
  process.argv[1] = process.argv[1].replace('disb', 'di-site-builder');
}

program.parse(process.argv);
