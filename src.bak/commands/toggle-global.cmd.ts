import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { Logger } from "../utils/logger";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "toggle-global";

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return;

        const api = bot.getApi();
        if (!api) return;

        if (!args[1] || !args[1].startsWith(bot.getPrefix()) || args[1].length <= bot.getPrefix().length) {
            await msg.reply("please provide a valid command to toggle globally!");
            return;
        }
        let cmd = args[1].slice(bot.getPrefix().length);
        const info = await api.getCommandInfo(cmd);
        if (!info) {
            return;
        }

        info.global = info.global === 0 ? 1 : 0;
        if (!(await api.updateCommand(info))) {
            await Logger.error("Command could not be updated!", __filename.replace(__dirname, "").slice(1));
            await msg.reply("fucko wucko, there is something wrong with our api!");
            return;
        }
        await msg.reply(`${(info.global === 1 ? "activated " : "deactivated ") + info.name} globally!`);
    };
}

export = new Command();
