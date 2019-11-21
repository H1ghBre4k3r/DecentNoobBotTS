import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { Logger } from "../utils/logger";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "help";

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        const api = bot.getApi();
        if (!api) return;

        // Request help for only 1 command
        if (args[1] && args[1].startsWith(bot.getPrefix())) {
            const command = await api.getCommandInfo(args[1].slice(bot.getPrefix().length));
            if (!command) {
                await msg.reply(`${args[1]} is not a valid command!`);
                return;
            }
            const commandEmbed = new Discord.RichEmbed()
                .setDescription(command.help)
                .setAuthor(`!${command.name}`)
                .setColor("#15f153")
                .setFooter(`Prefix: ${bot.getPrefix()} | This bot is still under construction!`);

            msg.channel.send(commandEmbed);
            return;
        }

        const commands = await api.getAllCommands();
        if (!commands) {
            await Logger.error("Commands could no be loaded!", __filename.replace(__dirname, "").slice(1));
            await msg.reply(`fucko wucko, something is wrong with our API!`);
            return;
        }

        // Iterate over all commands and press them into embeds with max 25 entries
        for (let i = 0; i < commands.length; i += 25) {
            const commandEmbed = new Discord.RichEmbed()
                .setDescription("Available Commands")
                .setAuthor("Help")
                .setColor("#15f153")
                // .addField("Server", msg.guild.name)
                .setFooter(
                    `Prefix: ${bot.getPrefix()} | Commands marked as 'restricted' may only be used by higher roles`,
                    bot.user.avatarURL
                );
            for (let j = i; j < commands.length; j++) {
                let c = commands[j];
                commandEmbed.addField(`!${c.name + (c.public !== 1 ? " - restricted" : "")}`, c.help);
            }
            msg.channel.send(commandEmbed);
        }

        return;
    };
}

export = new Command();
