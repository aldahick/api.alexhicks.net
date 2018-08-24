import * as orm from "typeorm";
import { Calendar } from "./Calendar";

@orm.Index(["calendar", "start", "end", "label"], { unique: true })
@orm.Entity()
export class CalendarEvent {
    constructor(init?: Partial<CalendarEvent>) {
        Object.assign(this, init);
    }

    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => Calendar, c => c.events, { nullable: false })
    calendar!: Calendar;

    @orm.Column()
    label!: string;

    @orm.Column()
    start!: Date;

    @orm.Column()
    end!: Date;
}
