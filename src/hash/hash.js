import { createReadStream } from 'fs';
import crypto from 'crypto';
import { resolve } from 'path';
import { OperationFailedError } from '../error/operationFailedError.js';

export class Hash {
    async calculateHash(filePath) {
        return new Promise((res, rej) => {
            const readStream = createReadStream(
                resolve(filePath)
            );
            
            const hash = crypto.createHash('sha256');

            readStream.on('error', () => {
                rej(new OperationFailedError());
            });

            readStream.pipe(hash);

            hash.on('finish', () => {
                const hex = hash.digest('hex');
                res(hex);
            });
        });
    };

    async printHash(filePath) {
        try {
            const hex = await this.calculateHash(...filePath);
            console.log(hex);
        } catch(err) {
            console.log(err.message);
        }
    }
}