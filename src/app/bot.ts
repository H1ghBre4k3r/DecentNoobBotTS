import * as Discord from "discord.js";
import $ from "./../util/logger";

import config from "./config/secret";
import CommandHandler from "./commands/commandHandler";

export class Bot extends Discord.Client {
    private prefix: string = "!";
    private readonly cmdHandler: CommandHandler = new CommandHandler(this);

    constructor(options?: Discord.ClientOptions) {
        super(options);
        this.bind();
        this.login(config.token);
    }

    /**
     * Bind events to specific methods.
     */
    private bind(): void {
        this.on("ready", this.onReady.bind(this));
        this.on("error", this.onError.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("guildMemberAdd", this.onGuildMemberAdd.bind(this));
    }

    private onReady(): void {
        $.log(`Logged in as ${this.user.tag}!`, "[Bot]");
    }

    private onError(err: string): void {
        $.err(err, "[Bot]");
    }

    private onMessage(message: Discord.Message): void {
        this.cmdHandler.execCmd(message);
    }

    private async onGuildMemberAdd(_member: Discord.GuildMember): Promise<void> {}

    public getPrefix(): string {
        return this.prefix;
    }
}
