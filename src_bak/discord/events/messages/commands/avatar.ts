import { Message, MessageEmbed, GuildMember, EmbedFieldData, User } from "discord.js";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for displaying the avatar of a user.
 */
@Command()
export class Avatar extends AbstractCommand {
    public cmd = "!avatar";

    @IsAllowed()
    public async run(msg: Message): Promise<void> {
        const args: string[] = msg.content.split(/ +/);
        const member =
            msg.guild?.member(msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg) || msg.author;

        const icon = member instanceof User ? member.displayAvatarURL() : member.user.displayAvatarURL();
        const avatarEmbed = new MessageEmbed()
            .setDescription(`Avatar of <@${member.id}>`)
            .setColor(member instanceof GuildMember ? member.displayHexColor : "DEFAULT")
            .setImage(icon);
        msg.channel.send(avatarEmbed);
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd} <@user>\`: Display the avatar of the mentioned user.`
        };
    }
}
