import * as db from "models";
import * as ical from "ical";
import * as _ from "lodash";
import * as moment from "moment";

export class Calendar {
    events: ical.EventItem[];

    constructor(ics: string) {
        this.events = Object.values(ical.parseICS(ics))
            .filter(e => e.type === "VEVENT") as any;
    }

    buildEventModels(): db.CalendarEvent[] {
        return this.events.map(evt =>
            evt.rrule === undefined ? [this.createEventModel(evt, moment(evt.start))] :
            evt.rrule.options.byweekday!.map(day => {
                const start = moment(evt.rrule.options.dtstart);
                const end = moment(evt.rrule.options.until);
                const weeks = moment.duration(end.diff(start)).asWeeks();
                const dates = _.range(weeks).map(w => {
                    const date = start.clone();
                    date.day(day);
                    date.week(date.week() + w);
                    return date;
                });
                return dates.map(date => this.createEventModel(evt, date));
            }).reduce((p, v) => p.concat(v), [])
        ).reduce((p, v) => p.concat(v), []);
    }

    createEventModel = (evt: ical.EventItem, date: moment.Moment) =>
        new db.CalendarEvent({
            label: evt.summary,
            start: date.set({
                hour: evt.start.getHours(),
                minute: evt.start.getMinutes()
            }).toDate(),
            end: date.set({
                hour: evt.end.getHours(),
                minute: evt.end.getMinutes()
            }).toDate()
        });
}
