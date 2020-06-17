import { ChatUserstate } from "tmi.js";

/**
 * Restrict certain functions to be only executable by mods.
 */
export function Mod(): (target: any, key: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor {
    // tslint:disable-next-line: only-arrow-functions
    return function(_target: any, _key: string | symbol, run: PropertyDescriptor): PropertyDescriptor {
        const fn = run.value;

        // tslint:disable-next-line: only-arrow-functions
        run.value = function(channel: string, user: ChatUserstate, message: string, self: boolean): void {
            if (user.mod || channel.slice(1).toLocaleLowerCase() === user["display-name"]?.toLocaleLowerCase()) {
                fn.apply(this, [channel, user, message, self]);
            }
        };

        return run;
    };
}
