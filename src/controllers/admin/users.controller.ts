import * as nest from "@nestjs/common";
import * as _ from "lodash";
import * as db from "models";
import * as providers from "providers";

@nest.UseGuards(
    providers.AuthGuard(),
    providers.PermissionGuard(db.UserRole.Admin)
)
@nest.Injectable()
@nest.Controller("users")
export class AdminUsersController {
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Get()
    async getAll() {
        return {
            users: await this.db.users.find().then(users =>
                users.map(u => _.omit(u, ["passwordHash", "passwordSalt"]))
            )
        };
    }
}
