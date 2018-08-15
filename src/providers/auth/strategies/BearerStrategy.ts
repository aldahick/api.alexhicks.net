import * as nest from "@nestjs/common";
import { Repositories } from "../../database";
import { Strategy } from "passport-http-bearer";
import { PassportStrategy } from "@nestjs/passport";
import { IValidationCallback } from "../IValidationCallback";

@nest.Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly db: Repositories
    ) { super(); }

    async validate(token: string, done: IValidationCallback) {
        const user = await this.db.users.findOne({ token });
        if (!user) return done(new nest.UnauthorizedException(), false);
        done(undefined, user);
    }
}
