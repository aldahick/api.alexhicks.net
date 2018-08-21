import * as nest from "@nestjs/common";
import * as express from "express";
import * as randomstring from "randomstring";
import * as db from "models";
import * as providers from "providers";

@nest.Injectable()
@nest.Controller("user")
export class UserController {
    constructor(
        private readonly db: providers.Repositories
    ) {}

    @nest.Post()
    async create(
        @nest.Body("username") username: string,
        @nest.Body("password") password: string
    ) {
        if (!username || !password) throw new nest.UnprocessableEntityException();
        const existingCount = await this.db.users.count({ username });
        if (existingCount > 0) throw new nest.ConflictException();
        const passwordSalt = randomstring.generate(32);
        const user = await this.db.users.save(this.db.users.create({
            username,
            passwordSalt,
            passwordHash: db.User.hashPassword(password, passwordSalt),
            token: randomstring.generate(32)
        }));
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
