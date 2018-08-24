import * as nest from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as db from "models";
import { CrudExecutor } from "lib";
import * as providers from "providers";

@nest.Injectable()
@nest.Controller("slackUser")
@nest.UseGuards(AuthGuard("bearer"))
export class SlackUserController {
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Post()
    async create(
        @nest.Body("name") name: string,
        @nest.Body("token") token: string,
        @providers.User() user: db.User
    ) {
        return {
            slackUser: await CrudExecutor.create(this.db.slackUsers, {
                name, token, user
            })
        };
    }

    @nest.Post(":id/attach/:calendarId")
    async attachCalendar(
        @nest.Param("id", { transform: Number }) id: number,
        @nest.Param("calendarId", { transform: Number }) calendarId: number,
        @nest.Body("statusText") statusText: string,
        @nest.Body("statusEmoji") statusEmoji: string | undefined,
        @providers.User() user: db.User
    ) {
        if (!statusText) throw new nest.UnprocessableEntityException();
        const slackUser = await CrudExecutor.getOne(this.db.slackUsers, id, user);
        const calendar = await CrudExecutor.getOne(this.db.calendars, calendarId, user);
        await CrudExecutor.create(this.db.slackUserCalendars, {
            user: slackUser,
            calendar,
            statusText,
            statusEmoji
        });
        return { ok: true };
    }
}
