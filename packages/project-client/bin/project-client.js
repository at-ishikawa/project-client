#! /usr/bin/env node

const packageJson = require('../package.json');
const program = require('commander');

program
    .version(packageJson.version)
    .command('create <projectType> [outputDirectory]', 'Create a project')
    .command('init', 'Configure initial settings for project-client cli')
    .parse(process.argv);
