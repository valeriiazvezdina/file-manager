import os from 'node:os';
import { OperationFailedError } from '../error/operationFailedError.js';
import { resolve } from 'node:path';

export class Navigation {
    #cwd;

    constructor() {
        this.#cwd = os.homedir();
    }

    getCwd() {
        return this.#cwd;
    }

    setCwd(path) {
        this.#cwd = path;
    }

    changeDirectory(dir) {
        return new Promise(async (res, rej) => {
            try {
                const absolutePath = path.resolve(dir);
                const folderExists = await fs.stat(absolutePath)
                                                                .then(stat => stat.isDirectory())
                                                                .catch(() => false);
                if (folderExists) {
                    this.setCwd(
                        resolve(this.getCwd(), dir)
                    );
                }
                console.log(`You are currently in ${this.getCwd()}`);
                res();
            } catch {
                rej(new OperationFailedError());
            }
        });   
    }

    async up() {
        try {
            const parentDir = '..';
            await this.changeDirectory(parentDir);
        } catch(err) {
            console.log(err.message);
        }
    }

    async cd(path) {
        try {
            await this.changeDirectory(...path);
        } catch(err) {
            console.log(err.message);
        }
    }
}