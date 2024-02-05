export const parseArgs = () => {
    let username = '';
    if (process.argv) {
        const cliArgs = process.argv.slice(2);
        username = cliArgs[0].split('=')[1];
    }
    return username;
};