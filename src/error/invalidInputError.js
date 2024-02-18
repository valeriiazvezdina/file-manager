export class InvalidUnputError extends Error {
    constructor() {
        super();
        this.message = 'Invalid input';
    }
}