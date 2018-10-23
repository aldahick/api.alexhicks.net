import * as orm from "typeorm";
import { User } from "../User";

@orm.Index(["user", "name"], { unique: true })
@orm.Entity()
export class Flag {
    constructor(init?: Partial<Flag>) {
        Object.assign(this, init);
    }

    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => User, u => u.flags)
    user!: User;

    @orm.Column()
    name!: string;

    @orm.Column()
    value!: string;
}
