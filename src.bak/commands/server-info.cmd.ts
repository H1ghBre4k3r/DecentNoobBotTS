import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "server-info";

    run = async (bot: Bot, msg: Discord.Message, _args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        const serverInfoEmbed = new Discord.RichEmbed()
            .setAuthor(msg.guild.name, msg.guild.iconURL)
            .setDescription("Server-Information")
            .setColor(msg.member.displayHexColor)
            .addField("Server-Name", msg.guild.name, true)
            .addField("ID", msg.guild.id, true)
            .addField("Created On", msg.guild.createdAt.toLocaleDateString("de-DE"), true)
            .addField("You Joined", msg.member.joinedAt.toLocaleDateString("de-DE"), true)
            .addField("Total Members", msg.guild.memberCount, true)
            .addField("Channels", msg.guild.channels.array().length, true)
            .addField("Owner", `<@${msg.guild.ownerID}>`, true)
            .addField("Roles", msg.guild.roles.array().length, true);

        msg.channel.send(serverInfoEmbed);
    };
}

export = new Command();
