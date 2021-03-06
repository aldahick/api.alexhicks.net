import * as orm from "typeorm";
import * as randomstring from "randomstring";
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

    @orm.Column()
    expires!: Date;

    @orm.BeforeInsert()
    updateExpiration() {
        if (this.expires === undefined || isNaN(this.expires.getTime())) {
            // set expiration to "1 day after creation"
            this.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            return;
        }
    }

    // schema:server-only

    static generateToken() {
        return randomstring.generate(32);
    }
}
