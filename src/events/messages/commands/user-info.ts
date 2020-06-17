import { Message, EmbedFieldData, MessageEmbed, GuildMember } from "discord.js";
import { Channel } from "../decorators/channel";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for displaying user information.
 */
@Command()
export class UserInfo extends AbstractCommand {
    public cmd = "!user-info";

    @IsAllowed()
    @Channel("text")
    public async run(msg: Message): Promise<void> {
        const args: string[] = msg.content.split(/ +/);
        const member =
            msg.guild?.member(msg.mentions.users.first() || msg.guild.members.cache.get(args[0]) || msg) || msg.author;
        const userInfoEmbed = new MessageEmbed()
            .setDescription(`Information about <@${member.id}>`)
            .setColor((member as GuildMember).displayHexColor)
            .setThumbnail((member as GuildMember).user.displayAvatarURL())
            .addField("Display-Name", (member as GuildMember).displayName, true)
            .addField("ID", member.id, true)
            .addField("Joined", (member as GuildMember).joinedAt?.toLocaleDateString("de-DE"), true)
            .addField("Highest Role", (member as GuildMember).roles.highest, true)
            .addField("Role-Count", (member as GuildMember).roles.cache.array().length, true);

        msg.channel.send(userInfoEmbed);
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd}\`: Get all some information about the a user.`
        };
    }
}

export default new UserInfo();
