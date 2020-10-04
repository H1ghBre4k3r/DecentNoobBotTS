import { Message, EmbedFieldData, MessageEmbed } from "discord.js";
import { Command } from "../decorators/command";
import { IsAllowed } from "../decorators/isAllowed";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for displaying help for commands.
 */
@Command()
export class Help extends AbstractCommand {
    public cmd = "!help";

    constructor() {
        // TODO: Use event bus in class
        super();
    }

    @IsAllowed()
    public async run(msg: Message): Promise<void> {
        const args: string[] = msg.content.split(/ +/);
        if (args[1]) {
            this.singleHelp(args[1], msg);
            return;
        }

        const commands = this.commandManager.keys();

        // Generate embeds with max 25 entries
        for (let i = 0; i < commands.length; i += 25) {
            const embed = new MessageEmbed()
                .setDescription("Available Commands")
                .setAuthor("Help")
                .setColor("#15f153")
                .setFooter(
                    "Commands marked as 'restricted' may only be used by higher roles \n'text', 'news' and 'dm' restricts command to those channel types"
                );
            for (let j = i; j < commands.length; j++) {
                const command = this.commandManager.getCommand(commands[j]);
                if (!command) {
                    continue;
                }
                embed.addField(
                    `${command.help.name}${(command.restricted ? " - *restricted*" : "") +
                        (command.channel ? " - " + command.channel.map(ch => `\`${ch}\``).join(" | ") : "")}`,
                    command.help.value
                );
            }
            msg.channel.send(embed);
        }
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: `\`${this.cmd}\`: Get all commands and their function. \n\`${this.cmd} <command>\`: Get help for <command>.`
        };
    }

    /**
     * Print a single help embed for a command.
     *
     * @param commandName name of the command to print the help embed for
     * @param msg message-object of to original message
     */
    private singleHelp(commandName: string, msg: Message): void {
        const command = this.commandManager.getCommand(commandName);
        if (!command) {
            return;
        }
        const embed = new MessageEmbed()
            .setDescription(command.help.value)
            .setAuthor(
                `${command.help.name}${(command.restricted ? " - restricted" : "") +
                    (command.channel ? " - " + command.channel.join(" | ") : "")}`
            )
            .setColor("#15f153")
            .setFooter(
                "Commands marked as 'restricted' may only be used by higher roles \n'text', 'news' and 'dm' restricts command to those channel types"
            );
        msg.channel.send(embed);
    }
}
