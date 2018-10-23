import * as _ from "lodash";
import * as nest from "@nestjs/common";
import { CrudExecutor } from "lib";
import * as db from "models";
import * as providers from "providers";

@nest.UseGuards(
    providers.AuthGuard(),
    providers.PermissionGuard(db.UserRole.User)
)
@nest.Injectable()
@nest.Controller("flags")
export class FlagsController {
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Get("find")
    async find(
        @nest.Query("name") name: string,
        @providers.User() user: db.User
    ) {
        const flag = await this.db.flags.findOne({ name, user });
        if (!flag) throw new nest.NotFoundException();
        return { flag };
    }

    @nest.Post()
    // create or update
    async set(
        @nest.Body("name") name: string,
        @nest.Body("value") value: string,
        @providers.User() user: db.User
    ) {
        let flag = await this.db.flags.findOne({ name, user });
        if (flag) {
            await this.db.flags.update(flag.id, { value });
            flag.value = value;
        } else {
            flag = await CrudExecutor.create(this.db.flags, {
                name, value, user
            });
        }
        return { flag };
    }

    @nest.Delete(":id")
    async delete(
        @nest.Param("id") id: number,
        @providers.User() user: db.User
    ) {
        const flag = await CrudExecutor.getOne(this.db.flags, id, user);
        await this.db.flags.delete(flag);
        return { ok: true };
    }
}
