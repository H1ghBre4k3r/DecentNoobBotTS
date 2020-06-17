import { EventEmitter } from "events";

/**
 * Class for allowing registration for events from outside of the child class.
 */
export class BaseEventCore extends EventEmitter {
    /**
     * Register for an event inside of this class.
     *
     * @param event name of the event to register for
     * @param fn function to execute, when event gets fired
     * @param context executioncontext of 'fn'
     */
    public register(event: string, fn: (...args: any) => void, context: any = this): void {
        this.on(event, fn.bind(context));
    }
}
