import * as nest from "@nestjs/common";
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
        if (!this.config.getBoolean("AUTH_ALLOW_REGISTRATION")) {
            throw new nest.UnauthorizedException();
        }
        const passwordSalt = randomstring.generate(32);
        const user = await CrudExecutor.create(this.db.users, {
            username,
            passwordSalt,
            passwordHash: db.User.hashPassword(password, passwordSalt),
            role: db.UserRole.None
        });
        return {
            id: user.id,
            token: await this.generateToken(username, password).then(r => r.token)
        };
    }

    @nest.Get("generateToken")
    async generateToken(
        @nest.Query("username") username: string,
        @nest.Query("password") password: string,
    ) {
        const user = await this.db.users.findOne({ username });
        if (!user || !user.verifyPassword(password)) throw new nest.UnauthorizedException();
        const userToken = await this.db.userTokens.save(new db.UserToken({
            user,
            token: randomstring.generate(32)
        }));
        return { token: userToken.token };
    }

    @nest.Get("canRegister")
    async canRegister() {
        return {
            canRegister: this.config.getBoolean("AUTH_ALLOW_REGISTRATION")
        };
    }
}
