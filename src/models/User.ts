import * as crypto from "crypto";
import * as orm from "typeorm";
import { UserRole, UserToken } from "models/auth";
import { Flag } from "models/flags";
import { MediaItem } from "models/media";

@orm.Index(["username"], { unique: true })
@orm.Entity()
export class User {
    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.Column()
    username!: string;

    @orm.Column()
    passwordHash!: string;

    @orm.Column()
    passwordSalt!: string;

    @orm.Column({ type: "int" })
    role!: UserRole;

    @orm.OneToMany(() => Flag, f => f.user)
    flags?: Flag[];

    @orm.OneToMany(() => MediaItem, mi => mi.user)
    mediaItems?: MediaItem[];

    @orm.OneToMany(() => UserToken, ut => ut.user)
    tokens?: UserToken[];

    // schema:server-only

    verifyPassword(password: string): boolean {
        return this.passwordHash === User.hashPassword(password, this.passwordSalt);
    }

    static hashPassword(password: string, salt: string): string {
        return crypto.createHash("sha256")
            .update(password + salt)
            .digest("hex");
    }
}
