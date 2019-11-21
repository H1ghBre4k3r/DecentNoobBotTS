import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

const responses = [
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

class Command extends CommandTemplate {
    command = "8ball";

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        if (!args[2]) {
            await msg.reply("Frag bitte eine ganze Frage!");
            return;
        }

        let answer = responses[Math.floor(Math.random() * responses.length)];
        let question = args.slice(1).join(" ");

        let ballEmbed = new Discord.RichEmbed()
            .setDescription("by " + msg.author.tag)
            .setAuthor("8Ball")
            .setColor("#ff9900")
            .addField("Question", `\`\`\`${question}\`\`\``)
            .addField("Answer", `\`\`\`${answer}\`\`\``);

        msg.channel.send(ballEmbed);
        return;
    };
}

export = new Command();
