import os from 'os';
import childProcess from 'child_process';
import fs from 'fs';
import jsonfile from 'jsonfile';
import rmdir from 'rmdir';
import process from 'process';
import Plugin from './Plugin';
import program from 'commander';

export default class CreateCommand {
    constructor() {
        this.VERSION = '0.1.0';
        this.readConfig();
    }

    readConfig() {
        this.projectConfigs = require('../configs.json');
        const userConfigFilePath = os.homedir() + '/.project-client.json';
        if (fs.existsSync(userConfigFilePath)) {
            const userConfig = jsonfile.readFileSync(userConfigFilePath);
            this.projectConfigs = Object.assign({}, this.projectConfigs, userConfig);
        }
    }

    execute(args) {
        this.checkArguments(args);
        let { projectType, outputDirectory } = args;

        const projectConfig = this.projectConfigs[projectType];
        this.plugins = this.getPlugins(projectConfig.plugins);
        const repository = projectConfig.repository;

        if (!outputDirectory) {
            if (projectConfig.outputDirectory) {
                outputDirectory = projectConfig.outputDirectory;
            } else {
                outputDirectory = projectType;
            }
        }

        this.preprocess();
        this.createProject(repository, outputDirectory);
        this.postprocess(outputDirectory);
    }

    getPlugins(pluginNames) {
        if (!pluginNames) {
            console.info('There is no plugins');
            return [];
        }

        if (!Array.isArray(pluginNames)) {
            pluginNames = [pluginNames];
        }
        return pluginNames.map(pluginName => Plugin.newInstance(pluginName));
    }

    checkArguments(args) {
        const { projectType, outputDirectory } = args;

        if (!(projectType in this.projectConfigs)) {
            const possibleProjectTypes = Object.keys(this.projectConfigs);
            throw new Error(`${projectType} cannot be created. Possible project types are one of ${possibleProjectTypes.join(", ")}`);
        }

        if (outputDirectory == '.') {
            throw new Error(`an output directory cannot be a current directory`);
        }
    }

    preprocess() {
        if (!this.plugins.length) {
            return;
        }

        console.info('Before create a project...');
        this.plugins.forEach(plugin => plugin.preprocess());
    }

    postprocess(outputDirectory) {
        if (!this.plugins.length) {
            return;
        }

        console.info('After create a project...');
        const currentDirectory = process.cwd();
        try {
            process.chdir(outputDirectory);
            this.plugins.forEach(plugin => plugin.postprocess());
        } finally {
            process.chdir(currentDirectory);
        }
    }

    createProject(repository, outputDirectory) {
        const command = "git " + [
            'clone',
            '--depth=1',
            repository,
            outputDirectory
        ].join(" ");

        try {
            childProcess.execSync(command);
            rmdir(outputDirectory + '/.git', (error) => {
                if (error) {
                    console.error(error);
                }
            });
        }  catch (e) {
            throw new Error(`${e.toString()}`);
        }
    }
}
