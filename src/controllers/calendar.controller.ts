import * as nest from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as db from "models";
import { CrudExecutor } from "lib";
import * as providers from "providers";

@nest.UseGuards(
    AuthGuard("bearer"),
    providers.PermissionGuard(db.UserRole.User)
)
@nest.Injectable()
@nest.Controller("calendar")
export class CalendarController {
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Post()
    async create(
        @nest.Body("name") name: string,
        @nest.Body("url") url: string,
        @providers.User() user: db.User
    ) {
        return {
            calendar: await CrudExecutor.create(this.db.calendars, {
                name, url, user
            })
        };
    }
}
