import { Message, EmbedFieldData } from "discord.js";
import { Command } from "../decorators/command";
import { Permission } from "../decorators/permission";
import { AbstractCommand } from "./abstractCommand";

@Command({
    global: true
})
export class Toggle extends AbstractCommand {
    public cmd = "!toggle";

    @Permission("MANAGE_MESSAGES")
    public async run(msg: Message): Promise<void> {
        const args = msg.content.split(/ +/).slice(1);
        const channel = msg.channel.id;

        if (args.length < 1) {
            msg.reply("please provide commands to toggle!");
            return;
        }

        for (const arg of args) {
            const command = await this.commandManager.getCommandInfo(arg);
            if (command) {
                if (command.channels.includes(channel)) {
                    this.commandManager.blockCommandInChannel(arg, channel).then(() => {
                        msg.reply(`'${arg}' successfully blocked!`);
                    });
                } else {
                    this.commandManager.allowCommandInChannel(arg, channel).then(() => {
                        msg.reply(`'${arg}' successfully allowed!`);
                    });
                }
            }
        }
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd} [cmd [cmd [cmd ...]]]\`: Toggle mentioned commands in this channel`
        };
    }
}
