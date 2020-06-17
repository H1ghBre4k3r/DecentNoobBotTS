import { Message, EmbedFieldData, MessageEmbed } from "discord.js";
import $ from "logsen";
import { createContext, runInContext } from "vm";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for executing JS-code in an isolated sandbox.
 */
@Command()
export class JS extends AbstractCommand {
    public cmd = "!js";

    // tslint:disable-next-line:cyclomatic-complexity
    @IsAllowed()
    public async run(msg: Message): Promise<void> {
        // Get code out of message
        const regex = /```js((\s|.)*)```/;
        const match = msg.content.match(regex);
        if (match) {
            const code = match[1];
            if (!code || code.trim() === "") {
                msg.reply("please provide valid JS-code!");
                return;
            }

            const embed = new MessageEmbed()
                .setDescription(`von ${msg.author.tag}`)
                .setAuthor("JavaScript")
                .addField("Code", `\`\`\`js\n${code}\`\`\``);

            // Create sample code, so log and error are appending to a string
            const codeToExecute = `console.log = function(d) { t += d; }; \n console.error = function(d) { t+= d; }; ${code}`;

            // Create sandbox and try to run code
            const sandbox = {
                t: ""
            };
            createContext(sandbox);
            try {
                runInContext(codeToExecute, sandbox, {
                    timeout: 10000
                });
            } catch (e) {
                embed.setColor("#ff000").addField("Error", `\`\`\`\n${e.message}\`\`\``);
                try {
                    msg.channel.send(embed);
                } catch (e) {
                    $.err(e);
                }
                return;
            }

            // If the output is too long, then cut it
            if (sandbox.t.length > 1000) {
                sandbox.t = sandbox.t.substr(0, 1000);
            }

            embed.setColor("#ff9900").addField("Output", `\`\`\`\n${sandbox.t}\`\`\``);
            try {
                msg.channel.send(embed);
            } catch (e) {
                $.err(e);
            }
        }
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd} '<your-code>'\`: Execute JS-code in a VM. Your JavaScript-Code needs to have one quote at the beginning and one at the end! \n**Note**: You have to put your code into an JS-markdown-embed to run it via this command!`
        };
    }
}
