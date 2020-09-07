import { Inject, Singleton } from "dependory";
import { GuildMember } from "discord.js";
import dotenv from "dotenv";
import $ from "logsen";
// import { ExtendedRestClient } from "../../../api/restClient";
import { DiscordClient } from "../../discordClient";
dotenv.config();

/**
 * Class for handling events happening in a guild.
 */
@Singleton()
export class GuildEventHandler {
    @Inject()
    private bot!: DiscordClient;

    // @Inject()
    // private restClient!: ExtendedRestClient;

    constructor() {
        this.bind();
    }

    /**
     * Bind all important events.
     */
    private bind(): void {
        this.bot.register("guildMemberAdd", this.onGuildMemberAdd, this);
    }

    /**
     * Handle the event of a new member joining a guild.
     *
     * @param member member, who joined the guild
     */
    private async onGuildMemberAdd(member: GuildMember): Promise<void> {
        try {
            // const defaultRole = await this.restClient.getRoleCLient().getDefaultRoleForServer(member.guild.id);
            // if (!defaultRole) {
            //     return;
            // }
            const role = member.guild.roles.cache.get("479953406299996180");
            if (!role) {
                return;
            }
            member.roles.add(role);
        } catch (e) {
            $.err(e);
        }
    }
}
