import { Message, EmbedFieldData, MessageEmbed } from "discord.js";
import { Channel } from "../decorators/channel";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for displaying server-information.
 */
@Command()
export class ServerInfo extends AbstractCommand {
    public cmd = "!server-info";

    @IsAllowed()
    @Channel("text")
    public async run(msg: Message): Promise<void> {
        const inline = true;

        const embed = new MessageEmbed()
            .setAuthor(msg.guild?.name, msg.guild?.iconURL() ?? "")
            .setDescription("Server-Informationen")
            .setColor(msg.member?.displayHexColor as string)
            .addFields([
                {
                    name: "Server-Name",
                    value: msg.guild?.name,
                    inline
                },
                {
                    name: "ID",
                    value: msg.guild?.id,
                    inline
                },
                {
                    name: "Created On",
                    value: msg.guild?.createdAt.toLocaleDateString("de-DE"),
                    inline
                },
                {
                    name: "You Joined",
                    value: msg.member?.joinedAt?.toLocaleDateString("de-DE"),
                    inline
                },
                {
                    name: "Total Members",
                    value: msg.guild?.memberCount,
                    inline
                },
                {
                    name: "Channels",
                    value: msg.guild?.channels.cache.array().length,
                    inline
                },
                {
                    name: "Owner",
                    value: `<@${msg.guild?.ownerID}>`,
                    inline
                },
                {
                    name: "Roles",
                    value: msg.guild?.roles.cache.array().length,
                    inline
                }
            ]);
        msg.channel.send(embed);
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd}\`: Get all relevant information about the server.`
        };
    }
}
