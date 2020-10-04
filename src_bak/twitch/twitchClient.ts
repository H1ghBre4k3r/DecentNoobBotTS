import { Singleton } from "dependory";
import $ from "logsen";
import * as tmi from "tmi.js";

const { TWITCH_USER, TWITCH_PASS } = process.env;

@Singleton()
export class TwitchClient {
    private _client: tmi.Client;

    constructor() {
        const clientOptions: tmi.Options = {
            connection: {
                reconnect: true,
                secure: true
            },
            logger: $,
            channels: ["h1ghbre4k3r"],
            identity: {
                username: TWITCH_USER,
                password: TWITCH_PASS
            },
            options: {
                debug: true
            }
        };

        this._client = tmi.Client(clientOptions);

        this.bind();

        this._client.connect();
    }

    private bind(): void {
        this._client.on("connected", () => {
            $.success("Client successfully connected to Twitch API!");
        });
    }

    public get client(): tmi.Client {
        return this._client;
    }
}
