import { Message, EmbedFieldData } from "discord.js";
import { Command } from "../../../decorators/command";
import { Permission } from "../../../decorators/permission";
import { AbstractCommand } from "./abstractCommand";

@Command("!ping")
export class Ping extends AbstractCommand {
    constructor() {
        super();
    }

    @Permission("ADMINISTRATOR")
    public async run(msg: Message): Promise<void> {
        msg.channel.send("Pongy pong pong!");
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd}\`: Pong!`
        };
    }
}
