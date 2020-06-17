import { Message, EmbedFieldData } from "discord.js";
import { Command } from "../decorators/command";
import { Permission } from "../decorators/permission";
import { AbstractCommand } from "./abstractCommand";

@Command({
    global: true
})
export class Ping extends AbstractCommand {
    public cmd = "!ping";

    @Permission("ADMINISTRATOR")
    public async run(msg: Message): Promise<void> {
        msg.channel.send("Pong!");
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd}\`: Pong!`
        };
    }
}
