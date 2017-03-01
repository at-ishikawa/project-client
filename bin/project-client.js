#! /usr/bin/env node
"use strict";

const childProcess = require('child_process');
const projectConfigs = require('../projectConfigs.json');

const subcommand = process.argv[2];
const projectType = process.argv[3];
let outputDirectory = process.argv[4];

if (subcommand != 'create') {
    console.error(`Error: subcommand must be create`);
    return;
}

if (!(projectType in projectConfigs)) {
    const possibleProjectTypes = Object.keys(projectConfigs);
    console.error(`Error: ${projectType} cannot be created. Possible project types are one of ${possibleProjectTypes.join(", ")}`);
    return;
}

if (outputDirectory == '.') {
    console.error(`Error: an output directory cannot be a current directory`);
    return;
}

const projectConfig = projectConfigs[projectType];
const repository = projectConfig.repository;

if (!outputDirectory && projectConfig.outputDirectory) {
    outputDirectory = projectConfig.outputDirectory;
}

try {
    const command = "git " + [
        'clone',
        repository,
        outputDirectory
    ].join(" ");
    const result = childProcess.execSync(command);
} catch (e) {
    console.error(`${e.toString()}`);
    return;
}
