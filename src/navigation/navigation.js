import os from 'node:os';
import { OperationFailedError } from '../error/operationFailedError.js';
import { resolve } from 'node:path';
import { stat } from 'node:fs/promises';

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
                const absolutePath = resolve(this.getCwd(), dir);;

                const stats = await stat(absolutePath);

                if (stats.isDirectory()) {
                    this.setCwd(
                        resolve(absolutePath)
                    );
                } else {
                    throw new OperationFailedError();
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