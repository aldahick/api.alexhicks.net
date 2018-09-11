import * as _ from "lodash";
import * as db from "models";
import { Repositories } from "providers";
import { ISeeder } from "lib/seed";

export class UserSeeder implements ISeeder<db.User> {
    readonly name = "users";
    readonly dependencies = [];

    async seed(repo: Repositories) {
        return _.range(50).map(i => repo.users.create({
            username: "user" + (i + 1),
            // password: demo-user
            passwordHash: "c211d44991c26d2c8ac268b71dd08bc52cae92dd6c8a2ff79c9408a630bc164b",
            passwordSalt: "uvN9qgUFpeycPF0xg7hiC1Tb5FB3GEnl",
            role: _.random(db.UserRole.Admin + 1)
        }));
    }
}
