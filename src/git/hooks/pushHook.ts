import { Singleton, Inject } from "dependory";
import { EmbedFieldData, MessageEmbed } from "discord.js";
import express from "express";
import { ExtendedRestClient } from "../../api/restClient";
import { Bot } from "../../bot/bot";
import { GitlabEventExecutor, GitWebhookManager } from "../gitWebhookManager";

/**
 * Interface for representing the PushEventBody of a gitlab webhook.
 */
interface PushEventBody {
    object_kind?: string;
    before?: string;
    after?: string;
    ref?: string;
    checkout_sha?: string;
    user_id?: number;
    user_name?: string;
    user_username?: string;
    user_avatar?: string;
    project_id?: number;
    project?: {
        id?: number;
        name?: string;
        description?: string;
        web_url?: string;
        avatar_url?: string | null;
        git_ssh_url?: string;
        git_http_url?: string;
        namespace?: string;
        visibility_level?: number;
        path_with_namespace?: string;
        default_branch?: string;
        homepage?: string;
        url?: string;
        ssh_url?: string;
        http_url?: string;
    };
    repository?: {
        name?: string;
        url?: string;
        description?: string;
        homepage?: string;
        git_http_url?: string;
        git_ssh_url?: string;
        visibility_level?: number;
    };
    commits?: {
        id?: string;
        message?: string;
        title?: string;
        timestamp?: string;
        url?: string;
        author?: {
            name?: string;
            email?: string;
        };
        added?: string[];
        modified?: string[];
        removed?: string[];
    }[];
}

/**
 * Class for mananaging Webhooks on Push Events.
 */
@Singleton()
export class PushHook implements GitlabEventExecutor {
    public evt = "Push Hook";

    @Inject()
    private bot!: Bot;

    @Inject()
    private gitWebhookManager!: GitWebhookManager;

    @Inject()
    private restClient!: ExtendedRestClient;

    constructor() {
        this.gitWebhookManager.on(this.evt, this.run.bind(this));
    }

    // tslint:disable-next-line:cyclomatic-complexity
    public async run(req: express.Request): Promise<void> {
        const body: PushEventBody = req.body;
        const token = req.headers["x-gitlab-token"];
        if (!token) {
            return;
        }

        const commits = body?.commits;
        const before = body?.before;
        const after = body?.after;
        const name = body?.project?.name;
        const projectUrl = body?.project?.web_url;
        const projectIconUrl = body?.project?.avatar_url ?? this.bot.user?.displayAvatarURL();
        const authorUsername = body?.user_username;
        const authorAvatarIconUrl = body?.user_avatar;
        const amount = commits?.length;
        const branch = body?.ref?.replace("refs/heads/", "");

        const embed = new MessageEmbed();

        if (authorUsername && authorAvatarIconUrl) {
            embed.setAuthor(authorUsername, authorAvatarIconUrl);
        }

        if (projectIconUrl) {
            embed.setThumbnail(projectIconUrl);
        }

        if (name && branch && amount) {
            embed.setTitle(`[${name}:${branch}] ${amount} new commit${amount > 1 ? "s" : ""}`);
        }

        if (projectUrl && before && after) {
            embed.setURL(`${projectUrl}/-/compare/${before}...${after}`);
        }

        if (commits) {
            const maxCommitMsgLen = 80;
            const chunkSize = 10;
            const maxChunks = 5;
            const fields: EmbedFieldData[] = [];

            const totalChunks = Math.min(maxChunks, Math.ceil(commits.length / chunkSize));
            let chunkIndex = 0;

            for (let i = 0; i < commits.length; i += chunkSize) {
                const commitSlice = commits.slice(i, i + chunkSize);
                const commitDescs = commitSlice.map(c => {
                    const id = c?.id?.substr(0, 7);
                    const url = c?.url;
                    const msg = c?.message?.split("\n")[0].substring(0, maxCommitMsgLen);
                    return `[\`${id}\`](${url}) ${msg}`;
                });
                fields.push({
                    name: `Commits ${chunkIndex + 1}/${totalChunks}`,
                    value: commitDescs.join("\n"),
                    inline: false
                });
                chunkIndex++;
            }

            embed.addFields(fields);
        }

        const channels: string[] = await this.restClient.getCIClient().getChannelsForToken(token as string);
        channels.forEach(ch => this.bot.send(ch, embed));
    }
}
