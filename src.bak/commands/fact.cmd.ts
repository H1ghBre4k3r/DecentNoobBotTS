import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";
import * as request from "request";

class Command extends CommandTemplate {
    command = "fact";

    run = async (bot: Bot, msg: Discord.Message, _args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        request.get(
            "http://randomuselessfact.appspot.com/random.json",
            { json: true },
            (_err: any, _res: request.Response, body: any) => {
                let factEmbed = new Discord.RichEmbed()
                    .setDescription("by " + msg.author.tag)
                    .setAuthor("Random Fact")
                    .setColor("#88ff88")
                    .addField("Fact", `\`\`\`${body.text}\`\`\``);

                msg.channel.send(factEmbed);
                return;
            }
        );
    };
}

export = new Command();
