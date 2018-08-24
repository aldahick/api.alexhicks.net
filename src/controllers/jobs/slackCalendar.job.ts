import * as nest from "@nestjs/common";
import axios from "axios";
import * as slack from "@slack/client";
import { Calendar } from "lib";
import * as db from "models";
import * as providers from "providers";

@nest.Injectable()
@nest.Controller()
export class SlackCalendarJob {
    private readonly logger = new nest.Logger("jobs/slackCalendar");
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Get()
    @providers.Scheduled(10 * 60)
    async updateSlackStatus() {
        const slackUsers = await this.db.slackUsers.createQueryBuilder("slack_user")
            .leftJoinAndSelect("slack_user.user", "user")
            .leftJoinAndSelect("slack_user.calendars", "slack_user_calendar")
                .leftJoinAndSelect("slack_user_calendar.calendar", "calendar")
                    .leftJoinAndSelect("calendar.events", "calendar_event")
            .getMany();
        await Promise.all(slackUsers.map(async user => {
            const now = new Date().getTime();
            const calendar = user.calendars!.map(c => ({
                statusText: c.statusText,
                statusEmoji: c.statusEmoji,
                events: c.calendar.events!.map(evt => ({
                    hasStarted: Math.abs(evt.start.getTime() - now) <= 15 * 60 * 1000,
                    hasEnded: Math.abs(evt.end.getTime() - now) <= 15 * 60 * 1000,
                    isCurrent: now < evt.end.getTime() && now >= evt.start.getTime()
                })).filter(e => e.hasEnded || e.hasStarted || e.isCurrent)
            })).find(c => c.events.length > 0);
            if (calendar === undefined) return;
            this.logger.log(`Updating Slack status for ${user.user.username}:${user.name} to ${calendar.statusText} ${calendar.statusEmoji}`);
            const client = new slack.WebClient(user.token);
            const onlyEnding = calendar.events.every(e =>
                e.hasEnded && !e.hasStarted && !e.isCurrent
            );
            await client.users.profile.set({
                profile: JSON.stringify({
                    "status_text": onlyEnding ? "" : calendar.statusText,
                    "status_emoji": onlyEnding ? "" : (calendar.statusEmoji || "")
                })
            });
        }));
    }

    @nest.Get()
    @providers.Scheduled(30 * 60)
    async fetchCalendars() {
        const calendars = await this.db.calendars.createQueryBuilder("calendar")
            .leftJoinAndSelect("calendar.events", "calendar_event")
            .getMany();
        if (calendars.length === 0) return;
        this.logger.log(`fetching ${calendars.length} calendars...`);
        const events = await Promise.all(calendars.map(async calendar => {
            const res = await axios.get(calendar.url);
            if (res.status !== 200) {
                this.logger.warn(`Couldn't fetch calendar ${calendar.id}: HTTP response ${res.status}`);
                return [];
            }
            const events = new Calendar(res.data).buildEventModels();
            events.forEach(evt => evt.calendar = calendar);
            return events;
        })).then(e => e.reduce((p, v) => p.concat(v), []));
        if (events.length === 0) return;
        this.logger.log(`fetched ${events.length} events!`);
        await this.db.calendarEvents.createQueryBuilder().insert()
            .into(db.CalendarEvent)
            .values(events)
            .onConflict("DO NOTHING")
            .execute();
        this.logger.log(`saved ${events.length} events!`);
    }
}
