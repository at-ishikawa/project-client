import childProcess from 'child_process';
import fs from 'fs';
import { Plugin } from 'project-client';

export default class NodePlugin extends Plugin {
    preprocess() {
    }

    postprocess() {
        if (fs.existsSync('./yarn.lock')) {
            childProcess.execSync('yarn install', {
                stdio: [0, 1, 2]
            });
        } else {
            childProcess.execSync('npm install', {
                stdio: [0, 1, 2]
            });
        }
    }
}
