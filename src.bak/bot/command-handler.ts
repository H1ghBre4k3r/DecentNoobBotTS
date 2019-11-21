import { Bot } from "./bot";
import { Logger } from "../utils/logger";
import * as Discord from "discord.js";
import * as fs from "fs";
import { CommandTemplate } from "../commands/CommandTemplate";

export interface CommandInfo {
    id: Number;
    name: String;
    help: String;
    global: Number;
    public: Number;
}

export class CommandHandler {
    /**
     * Instance Variables.
     */
    private commandPath = `${__dirname}/../commands/`;
    private cmdFileEnding = ".cmd";
    private readonly bot: Bot;
    private commands: Discord.Collection<string, CommandTemplate>;

    constructor(bot: Bot) {
        this.bot = bot;
        this.commands = new Discord.Collection();
        this.loadCommands();
    }

    private async loadCommands(): Promise<void> {
        fs.readdir(this.commandPath, { encoding: "utf8" }, async (err, files) => {
            if (err) {
                await Logger.error("Cannot load commands!", __filename.replace(__dirname, "").slice(1));
                await Logger.error(`${err}`);
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
                        await Logger.error(`Error loading command !${file}!`);
                        await Logger.error(`${e}`);
                    }
                }
            }
        });
    }

    public async executeCommand(msg: Discord.Message): Promise<void> {
        if (!this.isCommand(msg)) return;

        const args = msg.content.split(" ");
        const command = args[0];

        // Try to fetch the command
        const cmd = this.commands.get(command);
        if (!cmd) return;

        // Try to execute the command
        try {
            if (!(await this.bot.checkConnection())) {
                Logger.error(`The API is probably not online! Please check the connection!`);
                return;
            }
            await cmd.run(this.bot, msg, args);
        } catch (e) {
            Logger.error(`Error executing '!${command}'!`, __filename.replace(__dirname, "").slice(1));
            msg.channel.send("Upsi, some foozy boozy thing happened!");
        }
    }

    private isCommand(msg: Discord.Message): boolean {
        return !(msg.author.bot || msg.channel.type === "dm" || !msg.content.startsWith(this.bot.getPrefix()));
    }
}
