import * as orm from "typeorm";
import { User } from "models/User";

@orm.Index(["token"], { unique: true })
@orm.Entity()
export class UserToken {
    constructor(init?: Partial<UserToken>) {
        Object.assign(this, init);
    }

    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => User, u => u.tokens, { nullable: false })
    user!: User;

    @orm.Column()
    token!: string;

    @orm.CreateDateColumn()
    created!: Date;

    @orm.Column({ nullable: true })
    expires!: Date;

    @orm.BeforeInsert()
    updateExpiration() {
        // set expiration to "1 day after creation"
        this.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
}
