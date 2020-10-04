import { CIUserInformation } from "bre4k3r-api-client";
import { Message, EmbedFieldData } from "discord.js";
import $ from "logsen";
import { Channel } from "../decorators/channel";
import { Command } from "../decorators/command";
import { AbstractCommand } from "./abstractCommand";

/**
 * Command for registering to the CI functionality of this bot.
 */
@Command({
    global: true
})
export class CI extends AbstractCommand {
    public cmd = "!ci";

    constructor() {
        super();
        // TODO: See `Command` and use event bus in this class
        // TODO: Stop using stupid api. Use ORM instead. Thanks!
        this.on("register", this.register.bind(this));
        this.on("info", this.info.bind(this));
        this.on("toggle", this.toggle.bind(this));
        this.on("token", this.token.bind(this));
    }

    @Channel("dm")
    @Channel("text")
    public async run(msg: Message): Promise<void> {
        const args = msg.content.split(/ +/).slice(1);
        if (args.length < 1) {
            msg.reply("please provide more arguments! See `!help !ci` for help!");
        }
        this.emit(args[0], msg);
    }

    /**
     * Register a new user.
     */
    private async register(msg: Message): Promise<void> {
        try {
            let userInfo: CIUserInformation = await this.restClient.getCIClient().getUserInformation(msg.author.id);
            if (userInfo.registered) {
                msg.author.send(
                    `Heyo! \nYou are already registered for using the DecentNoobBot-Gitlab-CI-features! (Yes, very long name, I know) \nTo use them properly, you just have to register a webhook on Gitlab. Just go to \`Project -> Settings -> Webhooks -> New Webhook\`. \nYour token is ||\`${userInfo.token}\`||, keep it safe from anyone else, otherwise they can register webhooks for your channels! \nThe url for the webhook needs to be \`https://bot.git-ci.de\`. Tick the box for \`Push Events\`, so you can inform everyone about your cool new features!`
                );
            } else {
                userInfo = await this.restClient.getCIClient().registerUser(msg.author.id);
                msg.author.send(
                    `Heyo! \nYou successfully registered for using the DecentNoobBot-Gitlab-CI-features! (Yes, very long name, I know) \nTo use them properly, you just have to register a webhook on Gitlab. Just go to \`Project -> Settings -> Webhooks -> New Webhook\`. \nYour token is ||\`${userInfo.token}\`||, keep it safe from anyone else, otherwise they can register webhooks for your channels! \nThe url for the webhook needs to be \`https://bot.git-ci.de\`. Tick the box for \`Push Events\`, so you can inform everyone about your cool new features!`
                );
            }
        } catch (e) {
            $.err(e);
        }
    }

    /**
     * Get information about a user.
     */
    private async info(msg: Message): Promise<void> {
        try {
            const userInfo: CIUserInformation = await this.restClient.getCIClient().getUserInformation(msg.author.id);
            if (userInfo.registered) {
                msg.author.send(
                    `Hey! \nYou are currently registered for using the DecentNoobBot-Gitlab-CI-features. \nYou can register a new webhook under \`Project -> Settings -> Webhooks -> New Webhook\` for your Gitlab-Project. The url for the webhook needs to be \`https://bot.git-ci.de\`. Tick the box for \`Push Events\`, so you can inform everyone about your cool new features! Use your token as \`Secret Token\`!`
                );
            } else {
                msg.author.send(
                    `Hey! \nYou are currently not registered for using the DecentNoobBot-Gitlab-CI-features. \nIf you want to change this, use \`${this.cmd} register\`.`
                );
            }
        } catch (e) {
            $.err(e);
        }
    }

    /**
     * Toggle patch notes in a channel.
     */
    private async toggle(msg: Message): Promise<void> {
        try {
            const information = await this.restClient
                .getCIClient()
                .togglePatchNotesChannelForUser(msg.author.id, msg.channel.id);
            if (!information.token) {
                msg.reply(
                    `you are not registered for using the CI-features of this bot! If you want to change this, use \`${this.cmd} register\``
                );
                return;
            }
            msg.reply(
                `successfully ${
                    information.allowed ? "activated" : "deactivated"
                } patch-notes for this channel for your projects!`
            );
        } catch (e) {
            $.err(e);
        }
    }

    /**
     * Get the token of a user.
     */
    private async token(msg: Message): Promise<void> {
        try {
            const information = await this.restClient.getCIClient().getUserInformation(msg.author.id);
            if (information.registered) {
                msg.author.send(`Your secret token is ||\`${information.token}\`||. Keep it safe!`);
            } else {
                msg.author.send(
                    `You are currently not registered. If you want to change this, use \`${this.cmd} register\``
                );
            }
        } catch (e) {
            $.err(e);
        }
    }

    public get help(): EmbedFieldData {
        return {
            name: this.cmd,
            value: [
                `\`${this.cmd} info\`: Get all current CI information about you`,
                `\`${this.cmd} register\`: Register for the CI features and get your token`,
                `\`${this.cmd} toggle\`: Toggle the patch notes for your projects in a specific channel`,
                `\`${this.cmd} token\`: Get your current token`
            ]
        };
    }
}
