import { Singleton } from "dependory";
import { Client, ClientEvents, ActivityOptions } from "discord.js";
import $ from "logsen";

const { BOT_TOKEN } = process.env;

@Singleton()
export class DiscordClient extends Client {
    constructor() {
        super({});
        this.init();
    }

    /**
     * Initialize the bot.
     */
    private init(): void {
        this.login(BOT_TOKEN)
            .then(() => {
                $.success("Successfully connected to discord API!");
                this.setActivity({
                    type: "PLAYING",
                    name: "Fun Stuff!"
                });
            })
            .catch(err => {
                $.err("Failed to connect to discord API!", err);
                process.exit(1);
            });
    }

    /**
     * Allow registering for events on this instance.
     *
     * @param event event to register for
     * @param fn function to call when event gets fires
     * @param context execution-context of the function
     */
    public register<K extends keyof ClientEvents>(event: K, fn: (...args: any) => void, context: any = this): void {
        this.on(event, fn.bind(context));
    }

    /**
     * Set the activity for the bot.
     */
    public async setActivity(options: ActivityOptions): Promise<void> {
        await this.user?.setActivity(options);
    }
}
