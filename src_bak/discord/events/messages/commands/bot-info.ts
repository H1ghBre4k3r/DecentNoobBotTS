import { Inject } from "dependory";
import { Message, MessageEmbed, ClientUser, EmbedFieldData } from "discord.js";
import { DiscordClient } from "../../../discordClient";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for displaying information about the bot.
 */
@Command()
export class BotInfo extends AbstractCommand {
    public cmd = "!bot-info";

    @Inject()
    private bot!: DiscordClient;

    @IsAllowed()
    public async run(msg: Message): Promise<void> {
        const inline = true;

        const embed = new MessageEmbed()
            .setAuthor(this.bot.user?.username, this.bot.user?.displayAvatarURL())
            .setThumbnail(this.bot.user?.displayAvatarURL() as string)
            .setDescription("Bot-Informationen")
            .setColor(msg.guild?.member(this.bot.user as ClientUser)?.displayHexColor as string)
            .addFields([
                {
                    name: "Bot Name",
                    value: this.bot.user?.username,
                    inline
                },
                {
                    name: "Created On",
                    value: this.bot.user?.createdAt.toLocaleDateString("de-DE"),
                    inline
                },
                {
                    name: "Library",
                    value: "[discord.js](https://discord.js.org/#/)",
                    inline
                },
                {
                    name: "NodeJS",
                    value: process.version,
                    inline
                },
                {
                    name: "Servers",
                    value: `${this.bot.guilds.cache.size}`,
                    inline
                },
                {
                    name: "Users",
                    value: `${this.bot.users.cache.size}`,
                    inline
                },
                {
                    name: "Developer",
                    value: "<@224640348096299010>",
                    inline
                },
                {
                    name: "Source-Code",
                    value: "[GitBre4k3r](https://git.bre4k3r.de/dev-bre4k3r/decentnoobbot)",
                    inline
                }
            ]);
        msg.channel.send(embed);
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd}\`: Get all relevant information about the bot.`
        };
    }
}
