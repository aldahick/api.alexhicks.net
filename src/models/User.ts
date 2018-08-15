import * as crypto from "crypto";
import * as orm from "typeorm";

@orm.Entity()
export class User {
    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

    @orm.ObjectIdColumn()
    id?: orm.ObjectID;

    @orm.Column()
    username?: string;

    @orm.Column()
    token?: string;

    @orm.Column()
    passwordHash?: string;

    @orm.Column()
    passwordSalt?: string;

    verifyPassword(password: string): boolean {
        return this.passwordHash === User.hashPassword(password, this.passwordSalt!);
    }

    static hashPassword(password: string, salt: string): string {
        return crypto.createHash("sha256")
            .update(password + salt)
            .digest("hex");
    }
}
