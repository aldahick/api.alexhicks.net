import * as nest from "@nestjs/common";
import * as orm from "typeorm";
import { ConfigProvider } from "../config";
import { Repositories } from "./Repositories";
import { NamingStrategy } from "./NamingStrategy";
import * as models from "../../models";

export const DatabaseProvider: nest.Provider = {
    provide: "Repositories",
    inject: [ConfigProvider],
    useFactory: async (config: ConfigProvider) => {
        let connection: orm.Connection;
        if (orm.getConnectionManager().has("default")) {
            connection = orm.getConnection();
        } else {
            connection = await orm.createConnection({
                type: config.get("DB_TYPE") as any,
                host: config.get("DB_HOSTNAME"),
                port: Number(config.get("DB_PORT")),
                username: config.get("DB_USERNAME"),
                password: config.get("DB_PASSWORD"),
                database: config.get("DB_DATABASE"),
                entities: Object.values(models).filter(m => typeof(m) === "function") as any[],
                synchronize: true,
                namingStrategy: new NamingStrategy()
            });
        }
        return new Repositories(connection);
    }
};
