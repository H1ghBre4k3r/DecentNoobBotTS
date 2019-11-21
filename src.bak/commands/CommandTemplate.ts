import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { Logger } from "../utils/logger";

export class CommandTemplate {
    static async isAllowed(bot: Bot, msg: Discord.Message, command: string): Promise<Boolean> {
        const api = bot.getApi();
        if (!api) return false;
        const info = await api.getCommandInfo(command);
        if (!info) {
            await Logger.error(`Info for ${command} could not be loaded!`, __filename.replace(__dirname, "").slice(1));
            await msg.reply("upsi wupsi, there is something wrong with our API!");
            return false;
        }
        const allowed = await api.isCommandAllowed(msg.channel.id, info.id);
        return info.global === 1 || allowed;
    }

    run = async (_bot: Bot, _msg: Discord.Message, _args: string[]): Promise<void> => {
        // Gets overwritten in the command
        return;
    };
}
