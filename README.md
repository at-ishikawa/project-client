# Projctor

1. Install
```
$ npm install -g project-client
```

2. Configure to create for a project.
Wrote ~/.project-client.json
```
{
    "project": {
        "outputDirectory": "defaultOutputDirectory",
        "repository": "https://github.com/at-ishikawa/react-template.git"
    }
}
```

3. Create a project
```
$ project-client create [project_type]
```

- project_type can be one of *react*
