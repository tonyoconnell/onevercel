#!/usr/bin/env node

import { Command } from 'commander';
import { SiteGenerator } from '../../1';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

program
  .name('one')
  .description('ONE - AI Website Generator')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate website from configuration')
  .option('-c, --config <path>', 'Path to config file', '1.yaml')
  .action(async (options) => {
    const spinner = ora('Generating website...').start();
    
    try {
      const configPath = path.resolve(process.cwd(), options.config);
      const generator = new SiteGenerator(configPath);
      
      spinner.text = 'Validating configuration...';
      const isValid = await generator.validateConfig();
      
      if (!isValid) {
        spinner.fail('Invalid configuration');
        process.exit(1);
      }
      
      spinner.text = 'Generating website...';
      await generator.generate();
      
      spinner.succeed(chalk.green('Website generated successfully!'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate website'));
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start development server')
  .option('-c, --config <path>', 'Path to config file', '1.yaml')
  .action(async (options) => {
    const spinner = ora('Starting development server...').start();
    
    try {
      const configPath = path.resolve(process.cwd(), options.config);
      const generator = new SiteGenerator(configPath);
      
      const config = await generator.loadConfig();
      const { port, host } = config.development.server;
      
      // Start Astro dev server
      const { exec } = await import('child_process');
      exec(`astro dev --port ${port} --host ${host}`, (error, stdout, stderr) => {
        if (error) {
          spinner.fail(chalk.red('Failed to start development server'));
          console.error(error);
          process.exit(1);
        }
        
        spinner.succeed(chalk.green(`Development server running at http://${host}:${port}`));
        
        // Output server logs
        process.stdout.write(stdout);
        process.stderr.write(stderr);
      });
    } catch (error) {
      spinner.fail(chalk.red('Failed to start development server'));
      console.error(error);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build website for production')
  .option('-c, --config <path>', 'Path to config file', '1.yaml')
  .action(async (options) => {
    const spinner = ora('Building website...').start();
    
    try {
      const configPath = path.resolve(process.cwd(), options.config);
      const generator = new SiteGenerator(configPath);
      
      const config = await generator.loadConfig();
      const { target, env } = config.build;
      
      // Run Astro build
      const { exec } = await import('child_process');
      exec(`astro build`, async (error, stdout, stderr) => {
        if (error) {
          spinner.fail(chalk.red('Failed to build website'));
          console.error(error);
          process.exit(1);
        }
        
        spinner.succeed(chalk.green(`Website built successfully for ${target} (${env})`));
        
        // Output build logs
        process.stdout.write(stdout);
        process.stderr.write(stderr);
      });
    } catch (error) {
      spinner.fail(chalk.red('Failed to build website'));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(); 