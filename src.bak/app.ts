import { Bot } from "./bot/bot";
import { Api } from "./utils/api";

import secret from "./config/secret.json";

(async () => {
    const api: Api = new Api(secret.api, secret.api_token);
    const bot: Bot = new Bot({ disableEveryone: true });
    await bot.start(api, secret.bot_token);
})();

