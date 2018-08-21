import * as _ from "lodash";
import * as nest from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as express from "express";
import * as fs from "fs-extra";
import * as path from "path";
import * as randomstring from "randomstring";
import "multer";
import * as providers from "providers";
import * as db from "models";

@nest.Injectable()
@nest.Controller("media")
@nest.UseGuards(AuthGuard("bearer"))
export class MediaController {
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Get()
    async getMany(
        @nest.Query("dir") dir = "",
        @providers.User() user: db.User
    ) {
        dir = (dir.endsWith("/") ? dir : (dir + "/")).replace(/^\//, "");
        return {
            mediaItems: await this.db.mediaItems.createQueryBuilder("item")
                .where("item.user_id = :userId", { userId: user.id })
                    .andWhere("item.key LIKE :dir", { dir: dir + "%" })
                .getMany()
        };
    }

    @nest.Get("dirs")
    async getDirs(
        @nest.Query("dir") dir = "",
        @providers.User() user: db.User
    ) {
        const { mediaItems } = await this.getMany(dir, user);
        const dirs = _.uniq(
            mediaItems.map(i => path.dirname(i.key))
        ).map(d => d.split("/"));
        return {
            directories: _.uniq(dirs.map(dir => {
                if (dir.length === 0) return [];
                return _.range(1, dir.length + 1).map(
                    length => dir.slice(0, length).join("/")
                );
            }).reduce((p, v) => p.concat(v), [])).sort()
        };
    }

    @nest.Get(":id")
    async getOne(
        @nest.Param("id") id: number,
        @providers.User() user: db.User
    ) {
        return {
            mediaItem: await db.MediaItem.getForUser(this.db.mediaItems, id, user.id)
        };
    }

    @nest.Get(":id/content")
    async getContent(
        @nest.Param("id") id: number,
        @providers.User() user: db.User,
        @nest.Res() res: express.Response
    ) {
        const mediaItem = await db.MediaItem.getForUser(this.db.mediaItems, id, user.id);
        res.contentType(mediaItem.mimeType);
        res.sendFile(mediaItem.filePath);
    }

    @nest.UseInterceptors(nest.FileInterceptor("file"))
    @nest.Post()
    async create(
        @nest.Body("key") key: string,
        @nest.UploadedFile() file: Express.Multer.File,
        @providers.User() user: db.User
    ) {
        if (!key) throw new nest.UnprocessableEntityException();
        let mediaItem = this.db.mediaItems.create({ key });
        const existingCount = await this.db.mediaItems.count({
            key: mediaItem.key,
            user
        });
        if (existingCount > 0) throw new nest.ConflictException();
        mediaItem.filename = randomstring.generate(16);
        await fs.writeFile(mediaItem.filePath, file ? file.buffer : "");
        mediaItem = await this.db.mediaItems.save(
            this.db.mediaItems.create({
                ...mediaItem, user,
                mimeType: file ? file.mimetype : "text/plain"
            })
        );
        return { mediaItem };
    }

    @nest.Delete()
    async delete(
        @nest.Body("id") id: number,
        @providers.User() user: db.User
    ) {
        const item = await db.MediaItem.getForUser(this.db.mediaItems, id, user.id);
        await fs.unlink(item.filePath);
        await this.db.mediaItems.delete(item);
        return { ok: true };
    }
}
