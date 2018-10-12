import * as orm from "typeorm";
import * as models from "models";

export class Repositories {
    get userTokens() { return this.connection.getRepository(models.UserToken); }

    get calendars() { return this.connection.getRepository(models.Calendar); }
    get calendarEvents() { return this.connection.getRepository(models.CalendarEvent); }

    get mediaItems() { return this.connection.getRepository(models.MediaItem); }

    get slackUsers() { return this.connection.getRepository(models.SlackUser); }
    get slackUserCalendars() { return this.connection.getRepository(models.SlackUserCalendar); }

    get users() { return this.connection.getRepository(models.User); }

    constructor(
        private readonly connection: orm.Connection
    ) { }
}
