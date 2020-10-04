import RestClient from "bre4k3r-api-client";
import { Singleton } from "dependory";
import dotenv from "dotenv";
dotenv.config();

const { API_URL, AUTH_TOKEN } = process.env;

@Singleton()
export class ExtendedRestClient extends RestClient {
    constructor() {
        super(API_URL || "", AUTH_TOKEN || "");
    }
}
