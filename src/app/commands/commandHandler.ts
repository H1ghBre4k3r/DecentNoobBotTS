import * as Discord from "discord.js";
import * as fs from "fs";
import $ from "./../../util/logger";
import { Bot } from "./../bot";

export interface CommandTemplate {
    id: number;
    name: string;
    help: string;
    global: number;
    public: number;
}

/**
 * Class for handling commands.
 */
export default class CommandHandler {
    private commandPath = `${__dirname}/cmd/`;
    private cmdFileEnding = ".cmd";
    private commands: Discord.Collection<string, CommandTemplate> = new Discord.Collection();

    constructor(private readonly bot: Bot) {
        this.loadCommands();
    }

    /**
     * Load all commands out of the command-directory.
     */
    private async loadCommands(): Promise<void> {
        fs.readdir(this.commandPath, { encoding: "utf8" }, async (err, files) => {
            if (err) {
                $.err("Cannot load commands!", __filename.replace(__dirname, "").slice(1));
                $.err(`${err}`);
                return;
            }

            for (let file of files) {
                const fileParts = file.split(".");
                fileParts.pop();
                file = fileParts.join(".");
                if (file.endsWith(`${this.cmdFileEnding}`)) {
                    let cmd;
                    try {
                        cmd = await import(this.commandPath + file);
                        if (cmd) {
                            this.commands.set(`!${file.substr(0, file.length - 4)}`, cmd);
                        }
                    } catch (e) {
                        $.err(`Error loading command !${file}!`);
                        $.err(`${e}`);
                    }
                }
            }
        });
    }

    /**
     * Execute a given command.
     * @param msg
     *          Command to execute
     */
    public async execCmd(msg: Discord.Message): Promise<void> {
        if (!this.isCmd(msg)) return;
        $.log(msg.content);

        // TODO
        // const args = msg.content.split(" ");
        // const command = args[0];

        // // Try to fetch the command
        // const cmd = this.commands.get(command);
        // if (!cmd) return;

        // // Try to execute the command
        // try {
        //     if (!(await this.bot.checkConnection())) {
        //         $.err(`The API is probably not online! Please check the connection!`);
        //         return;
        //     }
        //     await cmd.run(this.bot, msg, args);
        // } catch (e) {
        //     $.err(`Error executing '!${command}'!`, __filename.replace(__dirname, "").slice(1));
        //     msg.channel.send("Upsi, some foozy boozy thing happened!");
        // }
    }

    /**
     * Check, if a given message is a command.
     * @param msg
     *          Message to check
     */
    private isCmd(msg: Discord.Message): boolean {
        return !(msg.author.bot || msg.channel.type === "dm" || !msg.content.startsWith(this.bot.getPrefix()));
    }
}
