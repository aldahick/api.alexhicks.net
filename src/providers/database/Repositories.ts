import * as orm from "typeorm";
import * as models from "models";

const tables = {
    userTokens: models.UserToken,
    flags: models.Flag,
    mediaItems: models.MediaItem,
    users: models.User
};
type TablesProvider = {
    [key in keyof typeof tables]: orm.Repository<(typeof tables)[key]["prototype"]>;
};

export class Repositories implements TablesProvider {
    readonly userTokens!: orm.Repository<models.UserToken>;
    readonly flags!: orm.Repository<models.Flag>;
    readonly mediaItems!: orm.Repository<models.MediaItem>;
    readonly users!: orm.Repository<models.User>;

    constructor(
        private readonly connection: orm.Connection
    ) {
        const tableNames = Object.keys(tables) as (keyof typeof tables)[];
        for (const tableName of tableNames) {
            this[tableName] = this.connection.getRepository(tables[tableName]);
        }
    }
}
