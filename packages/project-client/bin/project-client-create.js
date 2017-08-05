#! /usr/bin/env node

const program = require('commander');

program
    .arguments('<projectType> [outputDirectory]', 'Create a project')
    .action(function (projectType, outputDirectory) {
        program.projectType = projectType;
        program.outputDirectory = outputDirectory;
    })
    .parse(process.argv);

const CreateCommand = require('../dist/CreateCommand').default;
const command = new CreateCommand();
command.execute(program);
