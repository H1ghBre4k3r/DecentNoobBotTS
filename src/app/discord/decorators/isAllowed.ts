// import { Message } from "discord.js";
// import $ from "logsen";
// import { AbstractCommand } from "../commands/abstractCommand";

// /**
//  * Check, if this command is allowed in the channel it's being issued in.
//  */
// export function IsAllowed(): (
//     target: AbstractCommand,
//     key: string | symbol,
//     descriptor: PropertyDescriptor
// ) => PropertyDescriptor {
//     // tslint:disable-next-line:only-arrow-functions
//     return function(_target: AbstractCommand, _key: string | symbol, run: PropertyDescriptor): PropertyDescriptor {
//         const cmd = run.value;

//         // Use normal function, to keep track of context
//         // tslint:disable-next-line:only-arrow-functions
//         run.value = async function(msg: Message): Promise<any> {
//             try {
//                 // Fetch CommandInfo for the issued command
//                 const cmdInfo = await (this as AbstractCommand).commandManager.getCommandInfo(
//                     (this as AbstractCommand).cmd
//                 );

//                 if (!cmdInfo) {
//                     return;
//                 }

//                 // If command is global or allowed in channel, execute it
//                 if (
//                     cmdInfo.global ||
//                     (await (this as AbstractCommand).commandManager.isCommandAllowedInChannel(
//                         cmdInfo.cmd,
//                         msg.channel.id
//                     ))
//                 ) {
//                     cmd.apply(this, [msg]);
//                     return;
//                 }
//             } catch (e) {
//                 $.err(e);
//             }
//         };
//         return run;
//     };
// }
