import { Message, MessageEmbed, EmbedFieldData } from "discord.js";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for asking 8Ball.
 */
@Command()
export class EightBall extends AbstractCommand {
    private static responses = [
        "All signs point to yes...",
        "Yes!",
        "My sources say nope.",
        "You may rely on it.",
        "Concentrate and ask again...",
        "Outlook not so good...",
        "It is decidedly so!",
        "Better not tell you.",
        "Very doubtful.",
        "Yes - Definitely!",
        "It is certain!",
        "Most likely.",
        "Ask again later.",
        "No!",
        "Outlook good.",
        "Don't count on it."
    ];

    public cmd = "!8ball";

    @IsAllowed()
    public async run(msg: Message): Promise<void> {
        const args: string[] = msg.content.split(/ +/);
        if (!args[2]) {
            msg.reply("Frage bitte eine ganze Frage!");
            return;
        }

        const question = args.slice(1).join(" ");
        const answer = EightBall.responses[Math.floor(Math.random() * EightBall.responses.length)];

        const embed = new MessageEmbed()
            .setDescription(`by ${msg.author.tag}`)
            .setAuthor("8Ball")
            .setColor("#ff9900")
            .addFields(
                {
                    name: "Question",
                    value: `\`\`\`${question}\`\`\``
                },
                {
                    name: "Answer",
                    value: `\`\`\`${answer}\`\`\``
                }
            );

        msg.channel.send(embed);
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd} <question>\`: If you've got a mind-breaking question, ask 8Ball!`
        };
    }
}
