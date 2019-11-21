import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "toggle";

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return;

        const api = bot.getApi();
        if (!api) return;

        if (!args[1] || !args[1].startsWith(bot.getPrefix()) || args[1].length <= bot.getPrefix().length) {
            await msg.reply("please provide a valid command to toggle!");
            return;
        }

        let cmd = args[1].slice(bot.getPrefix().length);
        const info = await api.getCommandInfo(cmd);
        if (!info) {
            return;
        }

        const allowed = await api.isCommandAllowed(msg.channel.id, info.id);
        if (allowed) {
            const result = await api.blockCommand(msg.channel.id, info.id);
            if (result) {
                await msg.reply(`deactivated '!${cmd}' for this channel!`);
                return;
            }
        } else {
            const result = await api.allowCommand(msg.channel.id, info.id);
            if (result) {
                await msg.reply(`activated '!${cmd}' for this channel!`);
                return;
            }
        }
    };
}

export = new Command();
