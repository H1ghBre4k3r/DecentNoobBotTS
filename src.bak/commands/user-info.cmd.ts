import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "user-info";

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        let member = args[1]
            ? msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]))
            : msg.member;
        if (!member) return;

        const userInfoEmbed = new Discord.RichEmbed()
            .setDescription(`Information about <@${member.id}>`)
            .setColor(member.displayHexColor)
            .setThumbnail(member.user.avatarURL)
            .addField("Display-Name", member.displayName, true)
            .addField("ID", member.id, true)
            .addField("Joined", member.joinedAt.toLocaleDateString("de-DE"), true)
            .addField("Highest Role", member.highestRole, true)
            .addField("Role-Count", member.roles.array().length, true);

        msg.channel.send(userInfoEmbed);
    };
}

export = new Command();
