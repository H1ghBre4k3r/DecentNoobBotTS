import { Transient } from "dependory";

type EventObject = () => Promise<void>;

@Transient()
export class EventQueue {
    private _queue: EventObject[];

    constructor() {
        this._queue = [];
        setTimeout(this.loop.bind(this), 0);
    }

    public push(fn: EventObject): void {
        this._queue.push(fn);
    }

    private async loop(): Promise<void> {
        if (this._queue.length) {
            const batch =
                this._queue.shift() ??
                (async () => {
                    //
                });
            await batch();
        }
        setTimeout(this.loop.bind(this), 0);
    }
}
