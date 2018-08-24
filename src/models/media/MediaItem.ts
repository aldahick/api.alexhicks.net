import * as orm from "typeorm";
import { User } from "models/User";

@orm.Index(["user", "key"], { unique: true })
@orm.Entity()
export class MediaItem {
    @orm.PrimaryGeneratedColumn()
    id!: number;

    @orm.ManyToOne(() => User, u => u.mediaItems, { nullable: false })
    user!: User;

    @orm.Column({ nullable: false })
    key!: string;

    @orm.Column({ nullable: false })
    mimeType!: string;

    @orm.Column({ nullable: false })
    filename!: string;

    get filePath() {
        return process.cwd() + "/files/media/" + this.filename;
    }
}
