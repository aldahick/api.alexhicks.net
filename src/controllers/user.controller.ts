import * as nest from "@nestjs/common";
import * as express from "express";
import * as randomstring from "randomstring";
import { CrudExecutor } from "lib";
import * as db from "models";
import * as providers from "providers";

@nest.Injectable()
@nest.Controller("user")
export class UserController {
    constructor(
        private readonly config: providers.ConfigProvider,
        private readonly db: providers.Repositories
    ) {}

    @nest.Post()
    async create(
        @nest.Body("username") username: string,
        @nest.Body("password") password: string
    ) {
        if (!Boolean(this.config.get("AUTH_ALLOW_REGISTRATION") || "true")) {
            throw new nest.UnauthorizedException();
        }
        const passwordSalt = randomstring.generate(32);
        const user = await CrudExecutor.create(this.db.users, {
            username,
            passwordSalt,
            passwordHash: db.User.hashPassword(password, passwordSalt),
            token: randomstring.generate(32)
        });
        return {
            id: user.id,
            token: user.token
        };
    }

    @nest.Get("generateToken")
    async generateToken(
        @nest.Query("username") username: string,
        @nest.Query("password") password: string,
        @nest.Req() req: express.Request
    ) {
        const token = (req.headers.authorization || "").split(" ")[1];
        let user = await this.db.users.findOne({ token });
        if (!user) {
            user = await this.db.users.findOne({ username });
            if (!user || !user.verifyPassword(password)) throw new nest.UnauthorizedException();
        }
        user.token = randomstring.generate(32);
        await this.db.users.save(user);
        return { token: user.token };
    }
}
