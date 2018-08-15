import * as orm from "typeorm";
import * as models from "../../models";

export class Repositories {
    get mediaItems() { return this.connection.getRepository(models.MediaItem); }
    get users() { return this.connection.getMongoRepository(models.User); }

    constructor(
        private readonly connection: orm.Connection
    ) { }
}
