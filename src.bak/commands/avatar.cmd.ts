import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "avatar";

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        const member = args[1]
            ? msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]))
            : msg.member;
        const uIcon = member.user.avatarURL;
        const avatarEmbed = new Discord.RichEmbed()
            .setDescription(`Avatar of <@${member.id}>`)
            .setColor(member.displayHexColor)
            .setImage(uIcon);

        msg.channel.send(avatarEmbed);
    };
}

export = new Command();
