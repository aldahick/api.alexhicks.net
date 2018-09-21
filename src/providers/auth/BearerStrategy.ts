import * as nest from "@nestjs/common";
import { Repositories } from "providers/database";
import { Strategy } from "passport-http-bearer";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "models";
import { IValidationCallback } from "./IValidationCallback";

@nest.Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly db: Repositories
    ) { super(); }

    async validate(token: string, done: IValidationCallback) {
        const user = await User.getFromToken(this.db.users, token);
        return done(user ? undefined : new nest.UnauthorizedException(), user || false);
    }
}
