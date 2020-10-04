import { Message, EmbedFieldData } from "discord.js";
import { Command } from "../../../decorators/command";
import { Permission } from "../../../decorators/permission";
import { AbstractCommand } from "./abstractCommand";

@Command("!say")
export class Say extends AbstractCommand {
    @Permission("MANAGE_MESSAGES")
    public async run(msg: Message): Promise<void> {
        const args: string[] = msg.content.split(/ +/);

        if (!args[1]) {
            msg.reply("please provide a message to send!");
            return;
        }
        msg.delete().catch();
        msg.channel.send(args.slice(1).join(" "));
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd} <message>\`: Talk as your bot ;)`
        };
    }
}
