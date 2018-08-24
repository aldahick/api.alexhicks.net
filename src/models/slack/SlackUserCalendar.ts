import * as orm from "typeorm";
import { Calendar } from "models/calendar";
import { SlackUser } from "./SlackUser";

@orm.Index(["user", "calendar"], { unique: true })
@orm.Entity()
export class SlackUserCalendar {
    constructor(init?: Partial<SlackUserCalendar>) {
        Object.assign(this, init);
    }

    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => SlackUser, u => u.calendars, { nullable: false })
    user!: SlackUser;

    @orm.ManyToOne(() => Calendar, { nullable: false })
    calendar!: Calendar;

    /**
     * Status to set when calendar has an event
     */
    @orm.Column()
    statusText!: string;

    /**
     * Emoji to associate with statusText
     */
    @orm.Column({ nullable: true })
    statusEmoji?: string;

}
