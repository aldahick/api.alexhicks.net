import * as _ from "lodash";
import * as db from "models";
import { Repositories } from "providers";
import { ISeeder, SeederCache } from "lib/seed";

export class UserTokenSeeder implements ISeeder<db.UserToken> {
    readonly name = "userTokens";
    readonly dependencies: ISeeder<db.UserToken>["dependencies"] = [
        "users"
    ];

    async seed(repo: Repositories, cache: SeederCache) {
        return cache.users!.map(user =>
            _.range(3).map(() => repo.userTokens.create({
                user,
                token: db.UserToken.generateToken()
            }))
        ).reduce((p, v) => p.concat(v), []);
    }
}
