import * as orm from "typeorm";
import { CalendarEvent } from "./CalendarEvent";
import { User } from "models/User";

@orm.Index(["user", "name"], { unique: true })
@orm.Entity()
export class Calendar {
    constructor(init?: Partial<Calendar>) {
        Object.assign(this, init);
    }

    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => User, u => u.calendars, { nullable: false })
    user!: User;

    @orm.Column()
    name!: string;

    @orm.Column()
    url!: string;

    @orm.OneToMany(() => CalendarEvent, e => e.calendar)
    events?: CalendarEvent[];
}
