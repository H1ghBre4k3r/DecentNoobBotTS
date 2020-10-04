import { Singleton, Inject } from "dependory";
import { Message } from "discord.js";
import $ from "logsen";
import { Event } from "../../../../decorators/event";
import { Register } from "../../../../decorators/register";
import { Eventer } from "../../../../utils/eventer";
import { DiscordClient } from "../../discord";
import { AbstractCommand } from "./commands/abstractCommand";

export type ChannelType = "text" | "dm" | "news";

@Singleton()
@Register()
export class MessageManager {
    @Inject()
    private eventBus!: Eventer;

    private commands: Map<string, AbstractCommand> = new Map();

    /**
     * Handle an incomming message.
     * @param message message to handle
     */
    @Event("message", DiscordClient)
    public async onMessage(message: Message): Promise<void> {
        if (!message.author.bot) {
            const args = message.content.split(/ +/);
            this.emit(args[0], message);
        }
    }

    /**
     * Emit an event on this object.
     */
    public emit(event: string, ...args: any[]): boolean {
        return this.eventBus.emit(event, ...args);
    }

    /**
     * Register a function for an event on this object.
     */
    public on(event: string | symbol, listener: (...args: any[]) => void): this {
        this.eventBus.on(event, listener);
        return this;
    }

    public registerCommand(command: AbstractCommand): void {
        this.commands.set(command.cmd, command);
        this.on(command.cmd, command.run.bind(command));
        $.info(`Command '${command.cmd}' registered!`);
    }
}
