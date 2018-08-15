import * as dotenv from "dotenv";
import * as fs from "fs";
import { IConfigurationKey } from "./IConfigurationKey";

const REQUIRED_KEYS: IConfigurationKey[] = ["DB_TYPE"];

export class ConfigProvider {
    private readonly config: { [key in IConfigurationKey]: string };
    constructor() {
        const env = process.env.NODE_ENV || "dev";
        this.config = dotenv.parse(fs.readFileSync(`${env}.env`)) as any;
        const missingKeys = REQUIRED_KEYS.filter(k => !(k in this.config));
        if (missingKeys.length > 0) {
            throw new Error("Missing required configuration keys: " + missingKeys.join(", "));
        }
    }

    get(key: IConfigurationKey): string {
        return this.config[key];
    }
}
