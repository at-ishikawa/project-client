# Project Client

## Getting Started

1. Install a cli and some plugins that will be used.
```
$ npm install -g project-client project-client-plugin-[name]
$ project-client init
```

2. After run `project-client init`, you have configuration file in ``~/.project-client.json`.
The format of configuration is following:
```
{
    "project_type1": {
        "plugins": [
            "plugin1",
            "plugin2"
        ],
        "outputDirectory": "defaultOutputDirectory",
        "repository": "https://github.com/at-ishikawa/react-template.git"
    },
    "project_type2": {
    }
}
```

The detail for each configuration for projects are:
- `plugins <string | array> (required)` :: plugins for projects.
- `outputDirectory <string> (optional)` :: a directory's name to create a project unless output directory is not specified when a command runs.
  If outputDirectory is not specified, project_type1 will be the name of a directory.
- `repository <string> (required)` :: a git repository to download to create a project

3. Plugin configurations
If plugins are required, plugins are also required to install.
Also, set `NODE_PATH` to load plugins from project-client cli.
```
export NODE_PATH=`npm root -g`
```

4. Create a project
```
$ project-client create [project type] [output_directory]
```

- `project_type` can be one of *react*, *laravel* or projects which is configured in `~/.project-client.json`
- `output_directory` is optional.
