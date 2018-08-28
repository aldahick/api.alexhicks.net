import * as orm from "typeorm";
import { User } from "models/User";

@orm.Index(["user", "key"], { unique: true })
@orm.Entity()
export class MediaItem {
    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => User, u => u.mediaItems, { nullable: false })
    user!: User;

    @orm.Column()
    key!: string;

    @orm.Column()
    mimeType!: string;

    @orm.Column({ type: "bytea" })
    content!: Buffer;

    @orm.CreateDateColumn()
    created!: Date;
}
