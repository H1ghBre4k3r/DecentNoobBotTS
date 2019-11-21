import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "activity";

    activities = ["PLAYING", "STREAMING", "LISTENING", "WATCHING"];

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        if (!msg.member.hasPermission("ADMINISTRATOR")) return;

        if (args.length < 3) {
            await msg.reply("ooof...");
            return;
        }

        let type: "WATCHING" | "PLAYING" | "STREAMING" | "LISTENING" | undefined;
        switch (args[1].toLowerCase()) {
            case "--playing":
                type = "PLAYING";
                break;

            case "--streaming":
                type = "STREAMING";
                break;

            case "--listening":
                type = "LISTENING";
                break;

            case "--watching":
                type = "WATCHING";
                break;

            default:
                await msg.reply(
                    "oooof, please apply a valid activity-type as the first argument. Namely `--playing`, `--listening`, `--watching` or `--streaming`"
                );
                return;
        }

        await bot.user.setActivity(args.slice(2).join(" "), {
            type: type
        });

        await msg.reply("activity successfully set!");
    };
}

export = new Command();
