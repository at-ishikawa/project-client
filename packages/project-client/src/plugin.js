export default class Plugin {
    preprocess() {
    }

    postprocess() {
    }

    static newInstance(name) {
        const plugin = require('project-client-plugin-' + name).default;
        return new plugin();
    }
}
