import resolve from 'resolve';

export default class Plugin {
    preprocess() {
    }

    postprocess() {
    }

    static newInstance(name, dirname = process.cwd()) {
        // const filepath = resolve.sync('project-client-plugin-' + name, { basedir: dirname });
        // const plugin = require(filepath);
        const plugin = require('project-client-plugin-' + name).default;
        return new plugin();
    }
}
