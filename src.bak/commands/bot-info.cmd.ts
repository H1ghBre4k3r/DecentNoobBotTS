import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";

class Command extends CommandTemplate {
    command = "bot-info";

    run = async (bot: Bot, msg: Discord.Message, _args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        const botInfoEmbed = new Discord.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setThumbnail(bot.user.avatarURL)
            .setDescription("Bot-Information")
            .setColor((await msg.guild.fetchMember(bot.user)).displayHexColor)
            .addField("Bot Name", bot.user.username, true)
            .addField("Created On", bot.user.createdAt.toLocaleDateString("de-DE"), true)
            .addField("Library", `[discord.js](https://discord.js.org/#/)`, true)
            .addField("Version", bot.getVersion(), true)
            .addField("NodeJS", process.version, true)
            .addField("Servers", `${bot.guilds.size}`, true)
            .addField("Users", `${bot.users.size}`, true)
            .addField("Developer", "<@224640348096299010>", true)
            .addField("Source-Code", `[GitBre4k3r](https://git.bre4k3r.de/h1ghbre4k3r/decentnoobbotredux)`, true)
            .setFooter(`Prefix: ${bot.getPrefix()} | This Bot is still under construction!`);
        msg.channel.send(botInfoEmbed);
        return;
    };
}

export = new Command();
