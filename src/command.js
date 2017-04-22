import os from 'os';
import childProcess from 'child_process';
import fs from 'fs';
import jsonfile from 'jsonfile';
import rmdir from 'rmdir';

export default class Command {
    constructor() {
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

    execute() {
        try {
            let { projectType, outputDirectory } = this.parseArguments();

            const projectConfig = this.projectConfigs[projectType];
            const repository = projectConfig.repository;

            if (!outputDirectory && projectConfig.outputDirectory) {
                outputDirectory = projectConfig.outputDirectory;
            }

            this.createProject(repository, outputDirectory);
        } catch (e) {
            console.error(`Error: ${e}`);
        }
    }

    parseArguments() {
        const subcommand = process.argv[2];
        const projectType = process.argv[3];
        let outputDirectory = process.argv[4];

        if (subcommand != 'create') {
            throw new Error(`subcommand must be create`);
        }

        if (!(projectType in this.projectConfigs)) {
            const possibleProjectTypes = Object.keys(this.projectConfigs);
            throw new Error(`${projectType} cannot be created. Possible project types are one of ${possibleProjectTypes.join(", ")}`);
        }

        if (outputDirectory == '.') {
            throw new Error(`an output directory cannot be a current directory`);
        }


        return {
            subcommand: subcommand,
            projectType: projectType,
            outputDirectory: outputDirectory
        };
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
