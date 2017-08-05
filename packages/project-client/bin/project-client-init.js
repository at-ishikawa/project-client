#! /usr/bin/env node

const program = require('commander');

program
    .arguments('init', 'Configure initial settings')
    .parse(process.argv);

const InitCommand = require('../dist/InitCommand').default;
const command = new InitCommand();
command.execute(program);
