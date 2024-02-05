import { createInterface } from 'readline/promises';

export class Readline {
    start(username, currentDirectory, executeCommand) {
        this.rl = createInterface({
            input: process.stdin, 
            output: process.stdout, 
            prompt: '> '
        });

        console.log(`Welcome to the File Manager, ${username}!`);
        console.log(`You are currently in ${currentDirectory}`);
        this.rl.prompt();

        this.rl.on('close', () => {
            console.log(`Thank you for using File Manager, ${username}, goodbye!`);
            process.exit();
        });

        this.rl.on('line', async (line) => {
            if (line) {
                const commandAndArgs = this.retreiveCommandAndArgs(line);
                await executeCommand(commandAndArgs.command, commandAndArgs.arguments);
            }
            this.rl.prompt();
        });
    }

    retreiveCommandAndArgs(data) {
        const trimmedData = data.trim().split(' ');
        const [ command, ...args] = trimmedData;
        return {
            command: command,
            arguments: args
        };
    }

    stop() {
        this.rl.close();
    }

    printCurrentDirectory(currentDirectory) {
        console.log(`You are currently in ${currentDirectory}`);
    }
}