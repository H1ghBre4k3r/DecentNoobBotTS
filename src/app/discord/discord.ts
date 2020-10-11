/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Singleton } from "dependory";
import { Client, ClientEvents, ActivityOptions, TextChannel } from "discord.js";
import $ from "logsen";

const { BOT_TOKEN } = process.env;

@Singleton()
export class DiscordClient extends Client {
    public constructor() {
        super({});
        this.init();
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

    /**
     * Initialize the bot.
     */
    private init(): void {
        this.login(BOT_TOKEN)
            .then(() => {
                $.success("Successfully connected to discord API!");
                void this.setActivity({
                    type: "PLAYING",
                    name: "Fun Stuff!"
                });

                // Somehow we cannot fetch all guilds manually. Don't ask me why. DiscordJS ist merkwürdig.
                // this.guilds.cache.array().forEach(async g => {
                //     await g.fetch();
                //     console.log(this.channels.cache.array().length);
                //     this.channels.cache.array().forEach(c => {
                //         // setTimeout(() => {
                //         try {
                //             c.fetch()
                //                 .then(async c => {
                //                     if (c instanceof TextChannel) {
                //                         await c.messages
                //                             .fetch({
                //                                 limit: 100
                //                             })
                //                             .catch($.err);
                //                         console.log(c.name, c.messages.cache.array().length);
                //                     }
                //                 })
                //                 .catch($.err);
                //         } catch {
                //             //
                //         }
                //         // }, 0);
                //     });
                //     console.log("FINISHED");
                // });
            })
            .catch(err => {
                $.err("Failed to connect to discord API!", err);
                process.exit(1);
            });
    }
}
