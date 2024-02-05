import { Readline } from '../readline/readline.js';
import { Os } from '../os/os.js';
import { parseArgs } from '../args/parseArgs.js';
import { InvalidUnputError } from '../error/invalidInputError.js';
import { Fs } from '../fs/fs.js';
import { Hash } from '../hash/hash.js';
import { Zip } from '../zip/zip.js';
import { Navigation } from '../navigation/navigation.js';

export class App {
    #username;
    #currentDirectory;

    #readline = new Readline();
    #os = new Os();
    #fs = new Fs();
    #hash = new Hash();
    #zip = new Zip();
    #navigation = new Navigation();

    constructor() {
        this.commands = new Map([
            [ '.exit', () => this.#readline.stop() ],
            [ 'up', async () => await this.#navigation.up() ],
            [ 'cd', async (args) => await this.#navigation.cd(args) ],
            [ 'os', (args) => this.#os.handler(args) ],
            [ 'cat', async (args) => await this.#fs.printFile(args) ],
            [ 'add', async (args) => await this.#fs.runAddFile(args) ],
            [ 'rn', async (args) => await this.#fs.runRenameFile(args) ],
            [ 'cp', async (args) => await this.#fs.copyFile(args) ],
            [ 'mv', async (args) => await this.#fs.moveFile(args) ],
            [ 'rm', async (args) => await this.#fs.runDeleteFile(args) ],
            [ 'hash', async (args) => await this.#hash.printHash(args) ],
            [ 'compress', async (args) => await this.#zip.compress(args) ],
            [ 'decompress', async (args) => await this.#zip.decompress(args) ]
        ]);
        this.#username = parseArgs() ? parseArgs() : 'Username';
        this.#currentDirectory = this.#navigation.getCwd();
    }

    init() {
        this.#readline.start(this.getUsername(), this.getCurrentDirectory(), this.executeCommand);
    }

    setUsername(username) {
        this.#username = username;
    }

    getUsername() {
        return this.#username;
    }

    getCurrentDirectory() {
        return this.#currentDirectory;
    }

    handleCommand = (command, args) => {
        return new Promise((res, rej) => {
            const action = this.commands.get(command);
            if (!action) {
                rej(new InvalidUnputError());
            }
            res({ 
                command: action,
                args: args
            });
        })
    }

    executeCommand = async (command, args) => {
        try {
            const { command: action, args: params } = await this.handleCommand(command, args);
            if (!params) {
                await action();
            } else {
                await action(params);
            }
        } catch (err) {
            console.log(err.message);
        }
    }
}