import * as nest from "@nestjs/common";
import * as orm from "typeorm";
import { ConfigProvider } from "../config";
import * as models from "../../models";

@nest.Injectable()
export class DatabaseProvider {
    private get connection() { return orm.getConnection(); }

    get users() { return this.connection!.getMongoRepository(models.User); }

    constructor(
        private readonly config: ConfigProvider
    ) {
        orm.createConnection({
            ...DatabaseProvider.buildConfigFromProvider(this.config),
            entities: Object.values(models),
            synchronize: true
        }).catch(console.error);
    }

    static buildConfigFromProvider(provider: ConfigProvider): orm.ConnectionOptions {
        return {
            type: provider.get("DB_TYPE") as any,
            host: provider.get("DB_HOSTNAME"),
            port: provider.get("DB_PORT"),
            username: provider.get("DB_USERNAME"),
            password: provider.get("DB_PASSWORD"),
            database: provider.get("DB_DATABASE")
        };
    }
}
