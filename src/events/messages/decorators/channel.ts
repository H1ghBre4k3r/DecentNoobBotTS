import { Message } from "discord.js";
import { AbstractCommand } from "../commands/abstractCommand";
import { ChannelType } from "../messageHandler";

/**
 * Restrict commands or sub-functions to certain channel types.
 *
 * @param channel channel-type to allow messages in
 */
export function Channel(
    channel: ChannelType
): (target: AbstractCommand, key: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor {
    // tslint:disable-next-line:only-arrow-functions
    return function(target: AbstractCommand, _key: string | symbol, run: any): PropertyDescriptor {
        const cmd = run.value;

        // Push channeltype to allowed channels for function
        const ch = run.channel ?? [];
        ch.push(channel);
        run.channel = ch;

        // Push channeltype to allowed channels for command (needed for '!help')
        const targetChannel = target.channel ?? [];
        if (!targetChannel.includes(channel)) {
            targetChannel.push(channel);
        }
        target.channel = targetChannel;

        run.value = async function(msg: Message): Promise<void> {
            // Check, if current channel type is allowed
            if (run.channel && !run.channel.includes(msg.channel.type)) {
                return;
            }
            cmd.apply(this, [msg]);
        };
        return run;
    };
}
