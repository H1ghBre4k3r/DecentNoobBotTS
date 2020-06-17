import { Inject } from "dependory";
import { EmbedFieldData, Message } from "discord.js";
import { EventEmitter } from "events";
import { ExtendedRestClient } from "../../../api/restClient";
import { Database } from "../../../db/database";
import { CommandManager } from "../commandManager";
import { ChannelType } from "../messageHandler";

/**
 * Default interface for commands;
 */
// TODO: Remove EventEmitter and use event-bus in classes if needed
export abstract class AbstractCommand extends EventEmitter {
    @Inject()
    public restClient!: ExtendedRestClient;

    @Inject()
    public commandManager!: CommandManager;

    @Inject()
    public database!: Database;

    /**
     * String for calling this command.
     */
    public abstract cmd: string;
    /**
     * Field, containing information about the usage of the command.
     */
    public abstract help: EmbedFieldData;
    /**
     * Field, which indicates, whether a command needs permissions. Usually set by @Permission()
     */
    public restricted?: boolean;
    /**
     *
     */
    public channel?: ChannelType[];
    /**
     * Method, that gets executed, when this command is called.
     *
     * @param msg message, that called this command.
     */
    public abstract run(msg: Message): void;
}
