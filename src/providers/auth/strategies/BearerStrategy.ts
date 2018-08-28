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
        const userToken = await this.db.userTokens.createQueryBuilder("user_token")
            .innerJoinAndSelect("user_token.user", "user")
            .where("user_token.token = :token", { token })
            .getOne();
        if (!userToken || userToken.expires.getTime() <= Date.now()) {
            return done(new nest.UnauthorizedException(), false);
        }
        done(undefined, userToken.user);
    }
}
