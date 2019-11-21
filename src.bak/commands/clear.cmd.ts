import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "clear";

    run = async (_bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return;

        if (!args[1]) {
            msg.channel.send("oof!");
            return;
        }
        const count = +args[1];
        if (count > 99) {
            await msg.reply("you can only delete up to 99 messages at once!");
        }

        try {
            msg.channel.bulkDelete(+args[1]).then(async () => {
                msg.channel.send(`${args[1]} Nachrichten gelöscht!`).then(async msg => {
                    if (msg instanceof Discord.Message) {
                        await msg.delete(5000);
                    }
                });
            });
        } catch (e) {}
    };
}

export = new Command();
