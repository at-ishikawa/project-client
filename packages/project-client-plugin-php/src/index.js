import childProcess from 'child_process';
import { Plugin } from 'project-client';

export default class PhpPlugin extends Plugin {
    preprocess() {
    }

    postprocess() {
        childProcess.execSync('composer install', {
            stdio: [0, 1, 2]
        });
    }
}
