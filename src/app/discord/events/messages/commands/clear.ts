import { Message, EmbedFieldData } from "discord.js";
import $ from "logsen";
import { Command } from "../../../decorators/command";
import { Permission } from "../../../decorators/permission";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for clearing messages.
 */
@Command("!clear")
export class Clear extends AbstractCommand {
    @Permission("MANAGE_MESSAGES")
    public async run(msg: Message): Promise<void> {
        const args: string[] = msg.content.split(/ +/);
        if (!args[1]) {
            await msg.channel.send("oof!");
            return;
        }
        const count = (parseInt(args[1], 10) ?? 98) + 1;
        if (count > 99 || count < 1) {
            await msg.reply("you can only delete up to 99 message at once!");
            return;
        }

        try {
            await msg.channel.bulkDelete(count).then(async () => {
                await msg.channel.send(`deleted ${count} messages!`).then(async msg => {
                    if (msg instanceof Message && msg.deletable) {
                        await msg.delete({
                            timeout: 5000
                        });
                    }
                });
            });
        } catch (e) {
            $.err(e);
        }
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd} <count>\`: Delete some messages, if you want. ;)`
        };
    }
}
