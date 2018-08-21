import * as crypto from "crypto";
import * as orm from "typeorm";
import { MediaItem } from "./MediaItem";

@orm.Index(["username"], { unique: true })
@orm.Entity()
export class User {
    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.Column()
    username!: string;

    @orm.Column({ nullable: true })
    token?: string;

    @orm.Column()
    passwordHash!: string;

    @orm.Column()
    passwordSalt!: string;

    @orm.OneToMany(() => MediaItem, mi => mi.user)
    mediaItems?: MediaItem[];

    verifyPassword(password: string): boolean {
        return this.passwordHash === User.hashPassword(password, this.passwordSalt!);
    }

    static hashPassword(password: string, salt: string): string {
        return crypto.createHash("sha256")
            .update(password + salt)
            .digest("hex");
    }
}
