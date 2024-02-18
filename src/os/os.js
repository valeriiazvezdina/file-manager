import os from 'node:os';
import { InvalidUnputError } from '../error/invalidInputError.js';

export class Os {
    handler(args) {
        try {
            const param = args[0] ? args[0].slice(2) : new InvalidUnputError();
            switch (param) {
                case 'EOL':
                    console.log(JSON.stringify(os.EOL));
                    break;
                case 'cpus':
                    console.log(os.cpus());
                    break;
                case 'homedir':
                    console.log(os.homedir());
                    break;
                case 'username':
                    console.log(os.userInfo().username);
                    break;
                case 'architecture':
                    console.log(os.arch());
                    break;
                default:
                    throw new InvalidUnputError();
            }
        } catch(err) {
            console.log(err.message);
        }
    }
}