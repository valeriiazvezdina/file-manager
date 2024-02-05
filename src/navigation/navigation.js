import { OperationFailedError } from '../error/operationFailedError.js';

export class Navigation {
    async up(getCurrentDirectory, updateCurrentDirectory) {
        try {
            process.chdir('./src');
            console.log(getCurrentDirectory())
            const currentDirectory = updateCurrentDirectory();
            console.log(`You are currently in ${currentDirectory}`);
        } catch(err) {
            console.log(err.message)
        }
    }
}