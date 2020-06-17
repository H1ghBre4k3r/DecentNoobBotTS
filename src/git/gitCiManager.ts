import { Singleton, Inject } from "dependory";
import { Database } from "../db/database";

export interface CIUserInformation {
    user: string;
    token: string;
}

// TODO: Expand this
@Singleton()
export class GitCiManager {
    @Inject()
    private database!: Database;

    public async registerUser(user: string): Promise<CIUserInformation> {
        const userInformation = await this.database.getCiUser(user);
        if (!userInformation) {
            const token = this.generateRandomToken(48);
            return this.database.addCiUser(user, token);
        } else {
            return userInformation;
        }
    }

    private generateRandomToken(length: number): string {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
