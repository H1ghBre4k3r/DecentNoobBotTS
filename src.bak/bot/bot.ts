import * as Discord from "discord.js";
import { Logger } from "../utils/logger";
import { Api } from "../utils/api";
import { CommandHandler } from "./command-handler";

import config from "../config/config.json.js";

export class Bot extends Discord.Client {
    /**
     * Class-Variables
     */
    private api?: Api;
    private readonly version: string;
    private readonly prefix: string;
    private readonly commandHandler: CommandHandler;

    constructor(options?: Discord.ClientOptions) {
        super(options);
        this.prefix = config.prefix;
        this.version = config.version;
        this.commandHandler = new CommandHandler(this);
    }

    async start(api: Api, token: string): Promise<void> {
        this.setup(api, token);

        let connected = false;
        if (this.api) {
            connected = await this.api.checkConnection();
        }
        if (!connected) {
            await Logger.error(
                "No connection to API could be established!",
                __filename.replace(__dirname, "").slice(1)
            );
            process.exit(-1);
        }

        await this.login(this.token);
    }

    private setup(api: Api, token: string): void {
        this.api = api;
        this.token = token;

        this.on("ready", async () => {
            await this.user.setActivity("Half-Life 3", {
                type: "PLAYING"
            });
            await Logger.log(`Logged in as ${this.user.tag}!`, __filename.replace(__dirname, "").slice(1));
        });

        this.on("guildMemberAdd", async member => {
            // Check, if we already got an API and if it's online!
            if (!this.api) return;
            if (!(await this.checkConnection())) {
                Logger.error(`The API is probably not online! Please check the API and the connection to it!`);
                return;
            }
            // Assign the standard role to every new member
            const standardRole = await this.api.getDefaultServerRole(member.guild.id);
            if (!standardRole) return;
            await member.addRole(member.guild.roles.find(r => r.id == standardRole.role));
        });

        this.on("error", async err => {
            await Logger.error(`${err}`, __filename.replace(__dirname, "").slice(1));
        });

        this.on("message", async msg => {
            await this.commandHandler.executeCommand(msg);
        });
    }

    public async checkConnection(): Promise<boolean> {
        if (this.api) {
            return await this.api.checkConnection();
        }
        return false;
    }

    public getApi(): Api | undefined {
        return this.api;
    }

    public getVersion(): string {
        return this.version;
    }

    public getPrefix(): string {
        return this.prefix;
    }
}
