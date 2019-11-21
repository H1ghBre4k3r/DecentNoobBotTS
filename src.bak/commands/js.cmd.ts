import { Bot } from "../bot/bot";
import * as Discord from "discord.js";
import { CommandTemplate } from "./CommandTemplate";
import * as vm from "vm";

class Command extends CommandTemplate {
    command = "js";

    run = async (bot: Bot, msg: Discord.Message, _args: string[]): Promise<void> => {
        const isAllowed = await CommandTemplate.isAllowed(bot, msg, this.command);
        if (!isAllowed) return;

        /**
         * Create sandbox with to string for the "output".
         */
        const sandbox = {
            t: ""
        };
        vm.createContext(sandbox);

        /**
         * Create logging- and error-functions new, so they dont log but save as string.
         */
        let myCode = "console.log = function(d) { t += d; }; \n console.error = function(d) { t+= d; }; ";

        /**
         * Get Code from message and attach code (from above) to it.
         */
        let code = msg.content
            .split("\n")
            .join("")
            .substring(5, msg.content.length - 1);

        if (code.trim() == "") {
            await msg.reply("please enter some code for me!");
            return;
        }
        myCode += code;

        /**
         * Run code in sandbox.
         */
        try {
            vm.runInContext(myCode, sandbox, {
                timeout: 5000
            });
        } catch (e) {
            let errEmbed = new Discord.RichEmbed()
                .setDescription("von " + msg.author.tag)
                .setAuthor("JavaScript")
                .setColor("#ff0000")
                .addField("Code", "```javascript\n" + code + "```")
                .addField("Error", `\`\`\`${e.message}\`\`\``);

            msg.channel.send(errEmbed);
            return;
        }

        if (sandbox.t.length > 1000) {
            sandbox.t = sandbox.t.substr(0, 1000);
        }

        /**
         * Create RichEmbed, which will get returned.
         */
        let jsEmbed = new Discord.RichEmbed()
            .setDescription("von " + msg.author.tag)
            .setAuthor("JavaScript")
            .setColor("#ff9900")
            .addField("Code", "```javascript\n" + code + "```")
            .addField("Output", `\`\`\`${sandbox.t}\`\`\``);

        msg.channel.send(jsEmbed);
    };
}

export = new Command();
