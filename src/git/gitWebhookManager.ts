import bodyParser from "body-parser";
import { Singleton } from "dependory";
import { EventEmitter } from "events";
import express from "express";
import $ from "logsen";

/**
 * Default interface for commands;
 */
export interface GitlabEventExecutor {
    /**
     * Event, of which this Executor shall become active.
     */
    evt: string;
    /**
     * Method, that gets executed, when this event gets called.
     *
     * @param body body of the request
     */
    run(res: express.Request): void;
}

export type GitlabEvent = "Push Hook" | "Tag Push Hook" | "Job Hook" | "Pipeline Hook";

@Singleton()
export class GitWebhookManager extends EventEmitter {
    private static PORT = 4848;

    private server: express.Application;

    constructor() {
        super();
        this.server = express();
        // tslint:disable-next-line: deprecation
        this.server.use(bodyParser.json());
        this.bind();
        this.server.listen(GitWebhookManager.PORT, () => {
            $.success(`Server listeing on port ${GitWebhookManager.PORT}!`);
        });
    }

    private bind(): void {
        this.server.post("/", this.onPost.bind(this));
    }

    /**
     * Listener for post-requests.
     */
    private onPost(req: express.Request, res: express.Response): void {
        res.sendStatus(200);

        const header = req.headers;
        if (header && header["x-gitlab-event"]) {
            this.emit(header["x-gitlab-event"] as string, req);
        }
    }

    /**
     * Allow registering for events on this instance.
     *
     * @param event event to register for
     * @param fn function to call when event gets fires
     * @param context execution-context of the function
     */
    public register(event: GitlabEvent, fn: (...args: any) => void, context: any = this): void {
        this.on(event, fn.bind(context));
    }
}
