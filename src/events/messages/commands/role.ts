import { Message, EmbedFieldData } from "discord.js";
import $ from "logsen";
import { Channel } from "../decorators/channel";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { Permission } from "../decorators/permission";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for managing roles on the server.
 */
@Command({
    global: true
})
export class Role extends AbstractCommand {
    public cmd = "!role";

    // tslint:disable-next-line:cyclomatic-complexity
    @IsAllowed()
    @Channel("text")
    public async run(msg: Message): Promise<void> {
        const args: string[] = msg.content.split(/ +/);

        if (!args[1]) {
            msg.reply("please provide valid parameters! See `!help !role` for more details!");
            return;
        }

        switch (args[1]) {
            // Set the default role for a server
            case "--set-default":
                this.setDefaultRole(msg);
                return;

            // Get the default role for a server
            case "--default":
                try {
                    const roleId = await this.database.getDefaultRoleForServer(msg.guild?.id as string);
                    if (roleId) {
                        const role = msg.guild?.roles.cache.find(r => r.id === roleId);
                        if (role) {
                            msg.reply(`the default role on this server is \`${role.name}\`.`);
                        }
                    }
                } catch (e) {
                    $.err(e);
                    msg.channel.send("Upsi, wupsi, there is something wrong with our api... :/");
                }
                return;
        }
    }

    /**
     * Set the default role for a server.
     * Issuer needs to have permission to manage the roles.
     */
    @Permission("MANAGE_ROLES")
    private async setDefaultRole(msg: Message): Promise<void> {
        const args = msg.content.split(/ +/);
        if (!args[2]) {
            msg.reply("please provide valid parameters! See `!help !role` for more details!");
            return;
        }
        try {
            const role = msg.guild?.roles.cache.find(r => r.name === args[2]);
            if (role) {
                await this.database.setDefaultRoleForServer(msg.guild?.id as string, role.id);
                msg.reply(`successfully set '${role.name}' as default role for this server!`);
            }
        } catch (e) {
            $.err(e);
            msg.channel.send("Upsi, wupsi, there is something wrong with our api... :/");
        }
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: [
                `\`${this.cmd} --default\`: Get the default role for this server`,
                `\`${this.cmd} --set-default <role>\`: Set the default role for this server - \`restricted\``
            ].join("\n")
        };
    }
}
