import * as orm from "typeorm";
import { User } from "./User";

@orm.Entity()
export class MediaItem {
    @orm.ObjectIdColumn()
    id: number;

    @orm.ManyToOne(() => User, u => u.mediaItems, { nullable: false })
    user: User;

    @orm.Column()
    dir: string;

    @orm.Column()
    name: string;

    @orm.Column()
    contentType: string;

    @orm.Column()
    data: Buffer;
}
