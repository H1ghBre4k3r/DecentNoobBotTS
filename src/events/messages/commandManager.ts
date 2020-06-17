import { Singleton, Inject } from "dependory";
import { Database, CommandInfo } from "../../db/database";
import { AbstractCommand } from "./commands/abstractCommand";
import { CommandOptions } from "./decorators/command";
import { MessageHandler } from "./messageHandler";

@Singleton()
export class CommandManager {
    private map = new Map<string, AbstractCommand>();

    @Inject()
    private db!: Database;

    @Inject()
    private messageHandler!: MessageHandler;

    /**
     * Register a command for this command-manager and in the database.
     */
    public registerCommand(command: AbstractCommand, options: CommandOptions): void {
        this.map.set(command.cmd, command);
        this.messageHandler.register(command.cmd, command.run, command);
        this.db.addCommand(command.cmd).then(async () => {
            // console.log(cmd);
            const cmd = (await this.db.getCommand(command.cmd)) as CommandInfo;
            cmd.global = options.global as boolean;
            this.db.updateCommand(cmd);
        });
    }

    /**
     * Get the stored information about a command from `THIS` CommandManager, not from the database.
     * @param name
     */
    public getCommand(name: string): AbstractCommand | undefined {
        return this.map.get(name);
    }

    /**
     *
     */
    public keys(): string[] {
        return [...this.map.keys()];
    }

    /**
     * Allow a specific command in a specific channel.
     * @param cmd command to allow
     * @param channel id of the channel to allow the command in
     */
    public async allowCommandInChannel(cmd: string, channel: string): Promise<void> {
        const command = await this.db.getCommand(cmd);
        if (command) {
            if (!command.channels.includes(channel)) {
                command.channels.push(channel);
                await this.db.updateCommand(command);
            }
        }
    }

    /**
     * Block a command in a spcecific channel.
     * @param cmd command to block
     * @param channel id of the channel to block the command in
     */
    public async blockCommandInChannel(cmd: string, channel: string): Promise<void> {
        const command = await this.db.getCommand(cmd);
        if (command) {
            if (command.channels.includes(channel)) {
                command.channels.splice(command.channels.indexOf(channel), 1);
                await this.db.updateCommand(command);
            }
        }
    }

    /**
     * Check, if a command is allowed in a specified channel.
     * @param cmd command to check
     * @param channel id of the channel to check
     */
    public async isCommandAllowedInChannel(cmd: string, channel: string): Promise<boolean> {
        return !!(await this.db.getCommand(cmd))?.channels.includes(channel);
    }

    /**
     * Get all stored information about a command from the database.
     * @param cmd command to get the information for
     */
    public async getCommandInfo(cmd: string): Promise<CommandInfo | undefined> {
        return this.db.getCommand(cmd);
    }
}
