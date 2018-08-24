import * as orm from "typeorm";
import { SlackUserCalendar } from "./SlackUserCalendar";
import { User } from "models/User";

@orm.Index(["name", "token"], { unique: true })
@orm.Entity()
export class SlackUser {
    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => User, u => u.slackUsers, { nullable: false })
    user!: User;

    @orm.Column()
    name!: string;

    @orm.Column()
    token!: string;

    @orm.OneToMany(() => SlackUserCalendar, c => c.user)
    calendars?: SlackUserCalendar[];
}
