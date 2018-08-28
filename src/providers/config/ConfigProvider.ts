import * as dotenv from "dotenv";
import { IConfigurationKey } from "./IConfigurationKey";

const REQUIRED_KEYS: IConfigurationKey[] = ["DB_TYPE"];

export class ConfigProvider {
    private readonly config: { [key in IConfigurationKey]: string };
    constructor() {
        dotenv.config();
        this.config = process.env as any;
        const missingKeys = REQUIRED_KEYS.filter(k => !(k in this.config));
        if (missingKeys.length > 0) {
            throw new Error("Missing required configuration keys: " + missingKeys.join(", "));
        }
    }

    get(key: IConfigurationKey): string {
        return this.config[key];
    }
}
