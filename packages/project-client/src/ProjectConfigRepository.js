import fs from 'fs';
import fsExtra from 'fs-extra';
import jsonfile from 'jsonfile';
import os from 'os';
import ProjectConfig from "./ProjectConfig";

export default class ProjectConfigRepository {
    constructor(){
        this.defaultConfigFilePath = __dirname + '/../configs.json';
        this.userConfigFilePath = os.homedir() + '/.project-client.json';
    }

    readProjectConfigs()
    {
        const defaultConfig = this.readDefaultConfigFile();
        const userConfig = this.readUserConfigFile();
        const projectConfigs = Object.assign({}, defaultConfig, userConfig);
        return ProjectConfig.newInstances(projectConfigs);
    }

    readDefaultConfigFile()
    {
        return jsonfile.readFileSync(this.defaultConfigFilePath);
    }

    readUserConfigFile()
    {
        if (!fs.existsSync(this.userConfigFilePath)) {
            return {};
        }
        return jsonfile.readFileSync(this.userConfigFilePath);
    }

    copyConfig()
    {
        fsExtra.copySync(this.defaultConfigFilePath, this.userConfigFilePath);
    }
}
