import * as nest from "@nestjs/common";
import * as express from "express";
import * as providers from "../providers";
import * as randomstring from "randomstring";

@nest.Injectable()
@nest.Controller("user")
export class UserController {
    constructor(
        private readonly db: providers.Repositories
    ) {}

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
        return { ok: true, token: user.token };
    }
}
