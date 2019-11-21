/**
 * Class for representing a Logger.
 */
export class Logger {
    constructor() {}

    static async log(msg: String, file?: String): Promise<void> {
        if (file) {
            process.stdout.write(`[${file}] ${msg}\n`);
        } else {
            process.stdout.write(`${msg}\n`);
        }
    }

    static async error(msg: String, file?: String): Promise<void> {
        if (file) {
            process.stderr.write(`[${file}] ${msg}\n`);
        } else {
            process.stderr.write(`${msg}\n`);
        }
    }
}
