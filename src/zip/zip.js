import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { resolve } from 'node:path';

export class Zip {
    async brotliCompress(pathSource, pathDestination) {
        return new Promise((res, rej) => {
            const compressStream = createBrotliCompress();

            const sourceStream = createReadStream(
                resolve(pathSource)
            );
    
            const destinationStream = createWriteStream(
                resolve(pathDestination)
            );

            compressStream.on('error', () => {
                rej(new OperationFailedError());
            });

            sourceStream.on('error', () => {
                rej(new OperationFailedError());
            });

            destinationStream.on('error', () => {
                rej(new OperationFailedError());
            });

            destinationStream.on('finish', () => {
                res();
            });

            sourceStream.pipe(compressStream).pipe(destinationStream);
        });
    }

    async compress(args) {
        try {
            const [ pathSource, pathDestination ] = args;
            await this.brotliCompress(pathSource, pathDestination);
        } catch(err) {
            console.log(err);
        }
    }

    async brotliDecompress(pathSource, pathDestination) {
        return new Promise((res, rej) => {
            const decompressStream = createBrotliDecompress();

            const sourceStream = createReadStream(
                resolve(pathSource)
            );
    
            const destinationStream = createWriteStream(
                resolve(pathDestination)
            );

            decompressStream.on('error', () => {
                rej(new OperationFailedError());
            });

            sourceStream.on('error', () => {
                rej(new OperationFailedError());
            });

            destinationStream.on('error', () => {
                rej(new OperationFailedError());
            });

            destinationStream.on('finish', () => {
                res();
            });

            sourceStream.pipe(decompressStream).pipe(destinationStream);
        });
    }

    async decompress(args) {
        try {
            const [ pathSource, pathDestination ] = args;
            await this.brotliDecompress(pathSource, pathDestination);
        } catch(err) {
            console.log(err);
        }
    }
}