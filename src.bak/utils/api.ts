// import request from "request";
import * as request from "request";
import * as Commands from "./../bot/command-handler";

export class Api {
    /**
     * Instance Variables.
     */
    api: String;
    api_token: String;

    constructor(api: String, api_token: String) {
        this.api = api;
        this.api_token = api_token;
    }

    async checkConnection(): Promise<boolean> {
        return new Promise(resolve => {
            request.get(`${this.api}`, { json: true }, (_err: any, res: request.Response, _body: any) => {
                if (res && res.statusCode === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    async getCommandInfo(name: String): Promise<any> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/commands?token=${this.api_token}&name=${name}`,
                { json: true },
                (err: any, _res: request.Response, body: any) => {
                    if (err) return resolve(undefined);
                    return resolve(body[0]);
                }
            );
        });
    }

    async getAllCommands(): Promise<any> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/commands?token=${this.api_token}`,
                { json: true },
                (err: any, _res: request.Response, body: any) => {
                    if (err) return resolve(undefined);
                    return resolve(body);
                }
            );
        });
    }

    async updateCommand(info: Commands.CommandInfo): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/commands/update?token=${this.api_token}&name=${info.name}&help=${info.help}&global=${
                    info.global
                }&public=${info.public}`,
                { json: true },
                (err: any, _res: request.Response, _body: any) => {
                    if (err) return resolve(false);
                    return resolve(true);
                }
            );
        });
    }

    async isCommandAllowed(channel: String, command: String): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/commands/isallowed?token=${this.api_token}&channel=${channel}&command=${command}`,
                { json: true },
                (err: any, _res: request.Response, body: any) => {
                    if (err) return resolve(false);
                    return resolve(body.allowed);
                }
            );
        });
    }

    async allowCommand(channel: string, command: string): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/commands/allow?token=${this.api_token}&command=${command}&channel=${channel}`,
                { json: true },
                (err: any, _res: request.Response, _body: any) => {
                    if (err) return resolve(false);
                    resolve(true);
                }
            );
        });
    }

    async blockCommand(channel: string, command: string): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/commands/block?token=${this.api_token}&command=${command}&channel=${channel}`,
                { json: true },
                (err, _res, _body) => {
                    if (err) return resolve(false);
                    resolve(true);
                }
            );
        });
    }

    async getAllowedRoles(server: string): Promise<any> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/roles/allowed/all?token=${this.api_token}&server=${server}`,
                { json: true },
                (err, _res, body) => {
                    if (err) return resolve(false);
                    resolve(body);
                }
            );
        });
    }

    async isRoleAllowed(server: string, role: string): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/roles/allowed/check?token=${this.api_token}&server=${server}&role=${role}`,
                { json: true },
                (err, _res, body) => {
                    if (err) return resolve(false);
                    resolve(body.allowed);
                }
            );
        });
    }

    async allowRole(server: string, role: string): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/roles/allowed/add?token=${this.api_token}&server=${server}&role=${role}`,
                { json: true },
                (err, _res, _body) => {
                    if (err) return resolve(false);
                    resolve(true);
                }
            );
        });
    }

    async prohibitRole(server: string, role: string): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/roles/allowed/remove?token=${this.api_token}&server=${server}&role=${role}`,
                { json: true },
                (err, _res, _body) => {
                    if (err) return resolve(false);
                    resolve(true);
                }
            );
        });
    }

    async setDefaultServerRole(server: string, role: string): Promise<Boolean> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/roles/default/set?token=${this.api_token}&server=${server}&role=${role}`,
                { json: true },
                (err, _res, _body) => {
                    if (err) return resolve(false);
                    resolve(true);
                }
            );
        });
    }

    async getDefaultServerRole(server: string): Promise<any> {
        return new Promise(resolve => {
            request.get(
                `${this.api}/roles/default/get?token=${this.api_token}&server=${server}`,
                { json: true },
                (err, _res, body) => {
                    if (err) return resolve(false);
                    resolve(body[0]);
                }
            );
        });
    }
}
