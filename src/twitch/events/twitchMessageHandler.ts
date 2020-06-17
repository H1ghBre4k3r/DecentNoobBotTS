import { Singleton, Inject } from "dependory";
import { EventEmitter } from "events";
import { ChatUserstate } from "tmi.js";
import { Database } from "../../db/database";
import { TwitchClient } from "../twitchClient";
import { Mod } from "./decorator/mod";

/**
 * Interface for representing information about a command.
 */
export interface TwitchCommandInfo {
    /**
     * Channel, in which this command can be executed.
     */
    channel: string;
    /**
     * Command.
     */
    command: string;
    /**
     * Whether this is an alias or not.
     */
    alias: boolean;
    /**
     * Actual value of the command. This is either the output
     * or the name of the command, this command is the alias for.
     */
    value: string;
}

/**
 * Class for managing incomming messages.
 */
@Singleton()
export class TwitchMessageHandler extends EventEmitter {
    @Inject()
    private client!: TwitchClient;

    @Inject()
    private database!: Database;

    constructor() {
        super();
        this.bind();
    }

    private bind(): void {
        this.on("!com-add", this.onAdd.bind(this));
        this.on("!com-del", this.onDelete.bind(this));
        this.on("!com-edit", this.onEdit.bind(this));
        this.client.client.on("message", this.onMessage.bind(this));
    }

    /**
     * Method for handling incomming messages.
     */
    private async onMessage(channel: string, user: ChatUserstate, message: string, self: boolean): Promise<void> {
        if (self || user["message-type"] !== "chat") {
            return;
        }
        const args = message.trim().split(/ +/);

        if (this.emit(args[0], channel, user, message, self)) {
            return;
        }

        let cmd = await this.database.getTwitchCommand(channel, args[0]);
        // tslint:disable-next-line: no-conditional-assignment
        while (cmd && cmd.alias) {
            // !com-add "-a !com1 !com2"
            const v = cmd.value;
            const params = v.split(/ +/);
            cmd = await this.database.getTwitchCommand(channel, params[0]);
        }

        if (cmd) {
            this.client.client.say(channel, cmd.value);
        }
    }

    /**
     * Add a command.
     */
    @Mod()
    private async onAdd(channel: string, user: ChatUserstate, message: string, _self: boolean): Promise<void> {
        const args = message
            .trim()
            .split(/ +/)
            .slice(1);

        const alias = args[0] === "-a";
        const command = alias ? args[1] : args[0];
        const value = alias ? args[2] : args.slice(1).join(" ");
        await this.database.addTwitchCommand(channel, command, value, alias);
        this.client.client.say(channel, `${user["display-name"]}, command '${command}' successfully created!`);
    }

    /**
     * Delete a command in a channel.
     */
    @Mod()
    private async onDelete(channel: string, user: ChatUserstate, message: string, _self: boolean): Promise<void> {
        const args = message
            .trim()
            .split(/ +/)
            .slice(1);

        const command = args[0];
        if (command) {
            const success = await this.database.deleteTwitchCommand(channel, command);
            if (success) {
                this.database.getAliases(channel, command).then((aliases: TwitchCommandInfo[]) => {
                    aliases.forEach(a => {
                        this.database.deleteTwitchCommand(a.channel, a.command);
                    });
                });
                this.client.client.say(channel, `${user["display-name"]}, command '${command}' successfully deleted!`);
            }
        }
    }

    /**
     * Edit a message.
     */
    @Mod()
    private async onEdit(channel: string, user: ChatUserstate, message: string, _self: boolean): Promise<void> {
        const args = message
            .trim()
            .split(/ +/)
            .slice(1);

        const command = args.shift();
        const value = args.join(" ");

        if (command && value) {
            const cmd = await this.database.getTwitchCommand(channel, command);
            if (!cmd) {
                this.client.client.say(channel, `${user["display-name"]}, command '${command}' not found!`);
            } else {
                await this.database.addTwitchCommand(channel, command, value, false);
                this.client.client.say(channel, `${user["display-name"]}, command '${command}' successfully edited!`);
            }
        }
    }
}
