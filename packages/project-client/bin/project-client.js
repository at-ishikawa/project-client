#! /usr/bin/env node

const program = require('commander');
program
    .version('0.1.0')
    .command('create <projectType> [outputDirectory]', 'Create a project')
    .parse(process.argv);
