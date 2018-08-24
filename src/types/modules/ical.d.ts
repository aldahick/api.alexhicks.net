declare module "ical" {
    export type RepeatRule = {
        options: {
            freq: number;
            dtstart: Date;
            until: Date;
            interval: number;
            wkst: number;
            count?: number;
            bysetpos?: number[];
            bymonth?: number[];
            bymonthday?: number[];
            byyearday?: number[];
            byweekno?: number[];
            byweekday?: number[];
            byhour?: number[];
            byminute?: number[];
            bysecond?: number[];
            byeaster?: number[];
            bynmonthday?: number[];
            bynweekday?: number[];
        };
        timeset: {
            hour: number;
            minute: number;
            second: number;
        };
    };
    export type TimezoneItem = {
        type: "VTIMEZONE";
        tzid: string;
        "LIC-LOCATION": string;
        params: object[];
    };
    export type EventItem = {
        type: "VEVENT";
        start: Date;
        end: Date;
        dtstamp: string;
        uid: string;
        created: string;
        description: string;
        "last-modified": string;
        location: string;
        sequence: string;
        status: string;
        summary: string;
        transparency: "OPAQUE";
        rrule: RepeatRule;
    };
    export type CalendarItem = TimezoneItem | EventItem;
    export type CalendarItems = {[key: string]: CalendarItem};
    export function parseICS(ics: string): CalendarItems;
    export function parseFile(filename: string): CalendarItems;
}
