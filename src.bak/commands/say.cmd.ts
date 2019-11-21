import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "say";

    run = async (_bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            await msg.reply("No!");
            return;
        }
        if (!args[1]) {
            await msg.channel.send("oof!");
            return;
        }
        let botMessage = args.slice(1).join(" ");
        msg.delete().catch();
        msg.channel.send(botMessage);
    };
}

export = new Command();
