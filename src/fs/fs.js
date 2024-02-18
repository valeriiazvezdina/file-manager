import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { OperationFailedError } from '../error/operationFailedError.js';

export class Fs {
    async readFile(pathFile) {
        return new Promise((res, rej) => {
            let content = '';
            const readStream = createReadStream(
                resolve(pathFile)
            );

            readStream.on('data', (data) => {
                content += data;
            });

            readStream.on('error', () => {
                rej(new OperationFailedError());
            });

            readStream.on('end', () => {
                res(content);
            });
        });
    };

    async printFile(pathFile) {
        try {
            const content = await this.readFile(...pathFile);
            console.log(content);
        } catch(err) {
            console.log(err.message);
        }
    }

    async addEmptyFile(fileName) {
        try {
            await fs.writeFile(
                resolve(fileName),
                '',
                { flag: 'wx' }
            );
        } catch {
            throw new OperationFailedError();
        }
    }

    async runAddFile(args) {
        try {
            await this.addEmptyFile(...args);
        } catch(err) {
            console.log(err.message);
        }
    }

    async renameFile(pathOldFileName, pathNewFileName) {
        try {
            await fs.rename(
                resolve(pathOldFileName),
                resolve(pathNewFileName)
            );
        } catch {
            throw new OperationFailedError();
        }
    }

    async runRenameFile(args) {
        try {
            const [ pathOldFileName, pathNewFileName ] = args;
            await this.renameFile(pathOldFileName, pathNewFileName);
        } catch(err) {
            console.log(err.message);
        }
    }

    async copyStream(oldPath, newPath) {
        return new Promise((res, rej) => {
            const sourceStream = createReadStream(
                resolve(oldPath)
            );

            const destinationStream = createWriteStream(
                resolve(newPath)
            );

            sourceStream.on('error', () => {
                rej(new OperationFailedError());
            });

            destinationStream.on('error', () => {
                rej(new OperationFailedError());
            });

            sourceStream.on('end', () => {
                res();
            });

            sourceStream.pipe(destinationStream);
        });
    }

    async copyFile(args) {
        try {
            const [ oldPath, newPath ] = args;
            await this.copyStream(oldPath, newPath);
        } catch(err) {
            console.log(err.message);
        }
    }

    async moveFile(args) {
        try {
            const [ oldPath, newPath ] = args;
            await this.copyStream(oldPath, newPath)
                                                .then(async () => {
                                                    await this.deleteFile(oldPath);
                                                });
        } catch(err) {
            console.log(err.message);
        }
    }

    async deleteFile(path) {
        try {
            await fs.rm(
                resolve(path)
            );
        } catch {
            throw new OperationFailedError();
        }
    }

    async runDeleteFile(args) {
        try {
            await this.deleteFile(...args);
        } catch(err) {
            console.log(err.message);
        }
    }
}