import { Message, MessageEmbed, EmbedFieldData } from "discord.js";
import { get, Response } from "request";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for getting a random fact.
 */
@Command()
export class Fact extends AbstractCommand {
    public cmd = "!fact";

    @IsAllowed()
    public async run(msg: Message): Promise<void> {
        get(
            "http://randomuselessfact.appspot.com/random.json",
            { json: true },
            (_err: any, _res: Response, body: any) => {
                const embed = new MessageEmbed()
                    .setDescription("by " + msg.author.tag)
                    .setAuthor("Random Fact")
                    .setColor("#88ff88")
                    .addField("Fact", `\`\`\`${body.text}\`\`\``);

                msg.channel.send(embed);
            }
        );
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd}\`: Get a random (but useful) fact.`
        };
    }
}
