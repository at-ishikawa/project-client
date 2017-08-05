export default class ProjectConfig {

    constructor(config)
    {
        this.plugins = config.plugins;
        this.repository = config.repository;
        this.outputDirectory = config.outputDirectory;
    }

    static newInstances(configs)
    {
        const instances = {};
        Object.keys(configs).forEach(projectType => {
            instances[projectType] = new ProjectConfig(configs[projectType]);
        });
        return instances;
    }
}
