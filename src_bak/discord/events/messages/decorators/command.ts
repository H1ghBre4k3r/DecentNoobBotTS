import { AbstractCommand } from "../commands/abstractCommand";

/**
 * Options for creating a new command.
 */
export interface CommandOptions {
    /**
     * Flag for making a boolean command globally executable.
     * Defaults to `false`
     */
    global?: boolean;
}

const defaultOptions: CommandOptions = {
    global: false
};

/**
 * Command to be executed on discord.
 */
export function Command(options: CommandOptions = {}): (Fn: any) => void {
    for (const key of Object.keys(defaultOptions)) {
        (options as any)[key] = (options as any)[key] ?? (defaultOptions as any)[key];
    }

    // tslint:disable-next-line: only-arrow-functions
    return function(Fn: any): void {
        const cmd: AbstractCommand = new Fn();
        cmd.commandManager.registerCommand(cmd, options);
    };
}
