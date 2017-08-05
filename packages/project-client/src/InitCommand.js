import ProjectConfigRepository from "./ProjectConfigRepository";

export default class InitCommand {
    constructor()
    {
        this.projectConfigRepository = new ProjectConfigRepository();
    }

    execute()
    {
        this.copyConfig();
    }

    copyConfig()
    {
        this.projectConfigRepository.copyConfig();
        console.info(`Create file ${this.projectConfigRepository.userConfigFilePath}`);
    }
}
