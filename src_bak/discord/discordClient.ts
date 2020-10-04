import { Singleton } from "dependory";
import * as DiscordJS from "discord.js";
import dotenv from "dotenv";
import $ from "logsen";

dotenv.config();

/**
 * Fetch needed information out of the env-vars.
 */
const { BOT_TOKEN } = process.env;

/**
 * Class for representing a Discord bot.
 */
@Singleton()
export class DiscordClient extends DiscordJS.Client {
    /**
     * Storage for token.
     */
    private _token: string;

    /**
     * Create a new instance of the bot.
     *
     * @param token token for the Discord API.
     */
    constructor() {
        super();
        this._token = BOT_TOKEN ?? "";
        this.bind();
        this.start();
    }

    /**
     * Start the bot.
     * -> Connect to the API.
     */
    public start(token = this._token): void {
        this.login(token)
            .then(() => $.success("Successfully connected to Discord API!"))
            .catch(reason => $.err(reason));
    }

    /**
     * Bind all relevant events for this instance.
     */
    private bind(): void {
        this.on("ready", () => {
            $.info("Bot ready!");
            this.setActivity({
                type: "PLAYING",
                name: "NOT Animal Crossing!"
            });
        });
    }

    /**
     * Set the activity for the bot.
     */
    public async setActivity(options: DiscordJS.ActivityOptions): Promise<void> {
        await this.user?.setActivity(options);
    }

    /**
     * Allow registering for events on this instance.
     *
     * @param event event to register for
     * @param fn function to call when event gets fires
     * @param context execution-context of the function
     */
    public register<K extends keyof DiscordJS.ClientEvents>(
        event: K,
        fn: (...args: any) => void,
        context: any = this
    ): void {
        this.on(event, fn.bind(context));
    }

    /**
     * Send custom data to a channel.
     *
     * @param channel id of the channel to send a message to
     * @param data data to be send
     */
    public async send(channel: string, data: any): Promise<void> {
        try {
            ((await this.channels.fetch(channel)) as DiscordJS.TextChannel).send(data);
        } catch {
            //
        }
    }
}
