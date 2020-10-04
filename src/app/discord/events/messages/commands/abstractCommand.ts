import { Inject } from "dependory";
import { EmbedFieldData, Message } from "discord.js";
import { Eventer } from "../../../../../utils/eventer";
import { MessageManager, ChannelType } from "../messageManager";

/**
 * Default functionality for commands;
 */
export abstract class AbstractCommand {
    @Inject()
    private eventBus!: Eventer;

    @Inject()
    public messageManager!: MessageManager;

    /**
     * String for calling this command.
     */
    public cmd!: string;
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

    /**
     * Emit an event on this object.
     */
    public emit(event: string, ...args: any[]): boolean {
        return this.eventBus.emit(event, ...args);
    }

    /**
     * Register a function for an event on this object.
     */
    public on(event: string | symbol, listener: (...args: any[]) => void): this {
        this.eventBus.on(event, listener);
        return this;
    }
}
