import * as nest from "@nestjs/common";
import * as orm from "typeorm";
import { User } from "./User";

@orm.Index(["user", "key"])
@orm.Entity()
export class MediaItem {
    @orm.PrimaryGeneratedColumn()
    id: number;

    @orm.ManyToOne(() => User, u => u.mediaItems, { nullable: false })
    user: User;

    @orm.Column({ nullable: false })
    key: string;

    @orm.Column({ nullable: false })
    mimeType: string;

    @orm.Column({ nullable: false })
    filename: string;

    get filePath() {
        return "files/media/" + this.filename;
    }

    static async getForUser(
        repo: orm.Repository<MediaItem>,
        itemId: number,
        userId: number
    ): Promise<MediaItem> {
        const item = await repo.findOne({
            where: { id: itemId },
            join: {
                alias: "item",
                leftJoinAndSelect: {
                    user: "item.user"
                }
            }
        });
        if (!item) throw new nest.NotFoundException();
        if (item.user.id !== userId) throw new nest.UnauthorizedException();
        return item;
    }
}
