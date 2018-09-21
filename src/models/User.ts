import * as crypto from "crypto";
import * as orm from "typeorm";
import { UserRole, UserToken } from "models/auth";
import { Calendar } from "models/calendar";
import { MediaItem } from "models/media";
import { SlackUser } from "models/slack";

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

    @orm.OneToMany(() => Calendar, ce => ce.user)
    calendars?: Calendar[];

    @orm.OneToMany(() => MediaItem, mi => mi.user)
    mediaItems?: MediaItem[];

    @orm.OneToMany(() => SlackUser, su => su.user)
    slackUsers?: SlackUser[];

    @orm.OneToMany(() => UserToken, ut => ut.user)
    tokens?: UserToken[];

    verifyPassword(password: string): boolean {
        return this.passwordHash === User.hashPassword(password, this.passwordSalt!);
    }

    static hashPassword(password: string, salt: string): string {
        return crypto.createHash("sha256")
            .update(password + salt)
            .digest("hex");
    }

    static async getFromToken(repo: orm.Repository<User>, token: string) {
        const user = await repo.createQueryBuilder("user")
            .leftJoinAndSelect("user.tokens", "user_token")
            .where("user_token.token = :token", { token })
            .getOne();
        if (!user) return undefined;
        const userToken = user.tokens!.find(t => t.token === token);
        return (userToken && userToken.expires.getTime() > Date.now()) ? user : undefined;
    }
}
