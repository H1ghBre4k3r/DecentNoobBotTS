import { Inject, Singleton } from "dependory";
import { Message } from "discord.js";
import { Bot } from "../../bot/bot";
import { BaseEventCore } from "../baseEventCore";

export type ChannelType = "text" | "dm" | "news";

/**
 * Class for managing Messages.
 */
@Singleton()
export class MessageHandler extends BaseEventCore {
    @Inject()
    private bot!: Bot;

    constructor() {
        super();
        this.bind();
    }

    /**
     * Bind relevant methods.
     */
    private bind(): void {
        this.bot.register("message", this.onMessage, this);
    }

    /**
     * Handle a message.
     *
     * @param message messange to handle
     */
    public onMessage(message: Message): void {
        if (!message.author.bot) {
            const args = message.content.split(/ +/);
            this.emit(args[0], message);
        }
    }
}
