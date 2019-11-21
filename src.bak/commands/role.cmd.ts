import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { Logger } from "../utils/logger";
import { CommandTemplate } from "./CommandTemplate";

const ORDERS = ["--all", "--get", "--remove", "--allow", "--disallow", "--set-default", "--unset-default"];

const ALL = 0,
    ADD = 1,
    REMOVE = 2,
    ALLOW = 3,
    PROHIBIT = 4,
    SET_DEFAULT = 5;

class Command extends CommandTemplate {
    command = "role";

    run = async (bot: Bot, msg: Discord.Message, args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        const api = bot.getApi();
        if (!api) return;

        // Fetch all Roles from the message
        let mentions = [];
        for (let arg of args) {
            if (ORDERS.includes(arg)) continue;

            const role = msg.guild.roles.find(r => r.name == arg);
            if (role) {
                mentions.push(role);
            }
        }

        //const mentions = msg.mentions.roles.array();
        let mode = -1;

        for (let i = 0; i < args.length; i++) {
            const order = ORDERS.indexOf(args[i]);
            if (order != -1) {
                mode = order;
                break;
            }
        }

        // If user wants to perform an action he doesn't have permission to, DON'T DO IT!
        if (mode > 2 && !msg.member.hasPermission("MANAGE_ROLES")) {
            await msg.reply("you are not allowed to do that!");
            return;
        }

        // Now switch through all the possible "commands"
        switch (mode) {
            // Get all roles
            case ALL:
                const roles = await api.getAllowedRoles(msg.guild.id);
                let roleString = "";
                for (let role of roles) {
                    const r = msg.guild.roles.find(r => r.id == role.role);
                    if (r) {
                        roleString += `\`${r.name}\` , `;
                    }
                }
                await msg.reply(
                    `using \`!role --get [<role>]\`, you can request the following <roles>: ${roleString.substr(
                        0,
                        roleString.length - 3
                    )}`
                );
                return;

            // Add a role to a user
            case ADD:
                if (mentions.length == 0) {
                    await msg.reply("please apply a role to add!");
                    return;
                }
                for (let role of mentions) {
                    const allowed = await api.isRoleAllowed(msg.guild.id, role.id);
                    if (allowed) {
                        try {
                            await msg.member.addRole(role);
                        } catch (e) {}
                    }
                }
                break;

            // Remove a role from a user
            case REMOVE:
                if (mentions.length == 0) {
                    await msg.reply("please apply a role to remove!");
                    return;
                }
                try {
                    await msg.member.removeRoles(mentions);
                } catch (e) {}
                break;

            // Allow a role to be removed
            case ALLOW:
                if (mentions.length == 0) {
                    await msg.reply("please apply a role to allow!");
                    return;
                }
                for (let role of mentions) {
                    const success = await api.allowRole(msg.guild.id, role.id);
                    if (!success) {
                        await msg.reply("upsi wupsi, something is wrong with our api...");
                        await Logger.error("Error while allowing roles!", __filename.replace(__dirname, "").slice(1));
                        return;
                    }
                }
                await msg.reply(`successfully allowed roles \`${mentions.join("` ,`")}\`!`);
                break;

            // Prohibit a role to be removed
            case PROHIBIT:
                if (mentions.length == 0) {
                    await msg.reply("please apply a role to prohibit!");
                    return;
                }
                for (let role of mentions) {
                    const success = await api.prohibitRole(msg.guild.id, role.id);
                    if (!success) {
                        await msg.reply("upsi wupsi, something is wrong with our api...");
                        await Logger.error(
                            "Error while prohibiting roles!",
                            __filename.replace(__dirname, "").slice(1)
                        );
                        return;
                    }
                }
                await msg.reply(`successfully prohibited roles \`${mentions.join("` ,`")}\`!`);
                break;

            // Set the default server-role
            case SET_DEFAULT:
                if (mentions.length == 0) {
                    await msg.reply("please apply a default server-role!");
                    return;
                }
                const success = await api.setDefaultServerRole(msg.guild.id, mentions[0].id);
                if (success) {
                    await msg.reply(`successfully set new default server-role <@&${mentions[0].id}>!`);
                }
                break;

            default:
        }

        return;
    };
}

export = new Command();
