import { Singleton } from "dependory";
import { Sequelize, STRING, BOOLEAN } from "sequelize";
import { CIUserInformation } from "../git/gitCiManager";
import { TwitchCommandInfo } from "../twitch/events/twitchMessageHandler";
import { EventQueue } from "../utils/eventQueue";

export interface CommandInfo {
    cmd: string;
    global: boolean;
    channels: string[];
}

/**
 * Class for managing database actions.
 */
@Singleton()
export class Database {
    private sequelize: Sequelize;

    private commands!: any;
    private roles!: any;
    private ciUsers!: any;
    private twitchCommands!: any;

    private queue: EventQueue;

    constructor(queue: EventQueue) {
        this.queue = queue;

        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "./storage/database.db",
            logging: false
        });

        this.sequelize.authenticate();

        this.define();
        this.sequelize.sync();
    }

    private define(): void {
        this.commands = this.sequelize.define("commands", {
            cmd: {
                primaryKey: true,
                type: STRING
            },
            global: BOOLEAN,
            channels: STRING
        });

        this.roles = this.sequelize.define("roles", {
            server: {
                primaryKey: true,
                type: STRING
            },
            role: STRING
        });

        this.ciUsers = this.sequelize.define("ci-users", {
            user: {
                primaryKey: true,
                type: STRING
            },
            token: STRING
        });

        this.twitchCommands = this.sequelize.define("twitch-commands", {
            channel: STRING,
            command: STRING,
            alias: BOOLEAN,
            value: STRING
        });

        // !add-com -a !twitch !stream
    }

    /**
     * Register a new command to the database.
     * @param cmd name of the command to register
     */
    public async addCommand(cmd: string): Promise<CommandInfo> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                await this.commands
                    .findOrCreate({
                        where: {
                            cmd
                        },
                        defaults: {
                            cmd,
                            global: false,
                            channels: ""
                        }
                    })
                    .then(() => {
                        resolve();
                    });
            });
        });
    }

    /**
     * Get information about a command form the database.
     * @param cmd name of the command to get information for
     */
    public async getCommand(cmd: string): Promise<CommandInfo | undefined> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                await this.commands.findByPk(cmd).then((command: any) => {
                    if (command) {
                        command.channels =
                            command.channels
                                ?.split(",")
                                .map((i: string) => i.trim())
                                .filter((i: string) => i !== "") ?? [];
                    }
                    resolve(command);
                });
            });
        });
    }

    /**
     * Update the information about a command in the database.
     * @param cmd the new information about the command in the database
     */
    public async updateCommand(cmd: CommandInfo): Promise<void> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                await this.commands.findByPk(cmd.cmd).then((command: any) => {
                    if (command) {
                        command
                            .update({
                                cmd: cmd.cmd,
                                channels: cmd.channels.join(","),
                                global: cmd.global
                            })
                            .then(() => {
                                resolve();
                            });
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    /**
     * Set the default role for a server.
     * @param server id of the server to set the default role for
     * @param role id of the role to set as default
     */
    public async setDefaultRoleForServer(server: string, role: string): Promise<void> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                const defaultRole = await this.roles.findByPk(server);
                if (defaultRole) {
                    await defaultRole
                        .update({
                            server,
                            role
                        })
                        .then(() => resolve());
                } else {
                    await this.roles
                        .create({
                            server,
                            role
                        })
                        .then(() => resolve());
                }
            });
        });
    }

    /**
     * Get the default role for a server.
     * @param server id of the server to get the default role for
     */
    public async getDefaultRoleForServer(server: string): Promise<string | undefined> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                const defaultRole = await this.roles.findByPk(server);
                resolve(defaultRole?.role);
            });
        });
    }

    /**
     * Get all information about a specified ci user.
     * @param user id of the ci user
     */
    public async getCiUser(user: string): Promise<CIUserInformation | undefined> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                const userInformation = await this.ciUsers.findByPk(user);
                resolve(userInformation);
            });
        });
    }

    /**
     * Add a ci user to the database.
     * @param user id of the ci user
     * @param token secret token of the ci user
     */
    public async addCiUser(user: string, token: string): Promise<CIUserInformation> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                await this.ciUsers
                    .create({
                        user,
                        token
                    })
                    .then(resolve);
            });
        });
    }

    /**
     * TODO
     * @param user
     * @param token
     */
    public async updateCiUser(user: string, token: string): Promise<CIUserInformation> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                await this.ciUsers.findByPk(user).then(async (ciUser: any) => {
                    if (ciUser) {
                        ciUser.update({ user, token }).then(resolve);
                    }
                });
            });
        });
    }

    /**
     * Add a twitch command to the database. If it already exists, update its values.
     * @param channel channel this command is in
     * @param command name of the command
     * @param value value of the command
     * @param alias flag for being an alias
     */
    public async addTwitchCommand(channel: string, command: string, value: string, alias = false): Promise<void> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                const [cmd] = await this.twitchCommands.findAll({
                    where: {
                        channel,
                        command
                    }
                });
                if (cmd) {
                    await cmd
                        .update({
                            channel,
                            command,
                            value,
                            alias
                        })
                        .then(resolve);
                } else {
                    await this.twitchCommands
                        .create({
                            channel,
                            command,
                            value,
                            alias
                        })
                        .then(resolve);
                }
            });
        });
    }

    /**
     * Get command information from the database.
     * @param channel channel for the comamnd
     * @param command name of the command
     */
    public async getTwitchCommand(channel: string, command: string): Promise<TwitchCommandInfo | undefined> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                const [cmd] = await this.twitchCommands.findAll({
                    where: {
                        channel,
                        command
                    }
                });
                resolve(cmd);
            });
        });
    }

    /**
     * Get all aliases for a command.
     * @param channel channel to get the alaises for
     * @param command name of the command to get the aliases for
     */
    public async getAliases(channel: string, command: string): Promise<TwitchCommandInfo[]> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                const cmds = await this.twitchCommands.findAll({
                    where: {
                        channel,
                        alias: true,
                        value: command
                    }
                });
                resolve(cmds);
            });
        });
    }

    /**
     * Delete a comamnd from the database.
     * @param channel channel this command is in
     * @param command name of the command
     */
    public async deleteTwitchCommand(channel: string, command: string): Promise<boolean> {
        return new Promise(resolve => {
            this.queue.push(async () => {
                const [cmd] = await this.twitchCommands.findAll({
                    where: {
                        channel,
                        command
                    }
                });
                if (cmd) {
                    await cmd.destroy();
                    resolve(true);
                }
                resolve(false);
            });
        });
    }
}
