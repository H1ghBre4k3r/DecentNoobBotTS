import { Inject } from "dependory";
import { Message, ActivityType, EmbedFieldData } from "discord.js";
import { Bot } from "../../../bot/bot";
import { Command } from "../decorators/command";
import { Permission } from "../decorators/permission";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for setting the activity of the bot.
 */
@Command({
    global: true
})
export class Activity extends AbstractCommand {
    public cmd = "!activity";

    @Inject()
    private bot!: Bot;

    @Permission("ADMINISTRATOR")
    public async run(msg: Message): Promise<void> {
        if (!msg.member?.hasPermission("ADMINISTRATOR")) {
            return;
        }

        const args: string[] = msg.content.split(/ +/);
        if (args.length < 3) {
            msg.reply("ooof...");
        }

        let type: ActivityType;
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
        await this.bot.setActivity({
            type,
            name: args.slice(2).join(" ")
        });
        msg.reply("activity successfully set!");
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd} <type> <text>\`: Change the activity of the bot. You can set the following activity-types: \`--playing\`, \`--listening\`, \`--watching\` or \`--streaming\`. Please apply them as the 1. argument of your command.`
        };
    }
}
