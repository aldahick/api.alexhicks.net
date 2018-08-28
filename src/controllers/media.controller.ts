import * as _ from "lodash";
import * as nest from "@nestjs/common";
import * as express from "express";
import * as path from "path";
import "multer";
import { CrudExecutor } from "lib";
import * as db from "models";
import * as providers from "providers";

@nest.UseGuards(
    providers.AuthGuard(),
    providers.PermissionGuard(db.UserRole.User)
)
@nest.Injectable()
@nest.Controller("media")
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
            mediaItem: await CrudExecutor.getOne(this.db.mediaItems, id, user)
        };
    }

    @nest.Get(":id/content")
    async getContent(
        @nest.Param("id") id: number,
        @providers.User() user: db.User,
        @nest.Res() res: express.Response
    ) {
        const mediaItem = await CrudExecutor.getOne(this.db.mediaItems, id, user);
        res.contentType(mediaItem.mimeType);
        return mediaItem.content;
    }

    @nest.UseInterceptors(nest.FileInterceptor("file"))
    @nest.Post()
    async create(
        @nest.Body("key") key: string,
        @nest.Body("mimeType") mimeType: string,
        @nest.Body("content") content: string,
        @nest.UploadedFile() file: Express.Multer.File,
        @providers.User() user: db.User
    ) {
        return {
            mediaItem: await CrudExecutor.create(this.db.mediaItems, {
                key, user,
                mimeType: file ? file.mimetype : (mimeType || "text/plain"),
                content: file ? file.buffer : new Buffer(content || "")
            })
        };
    }

    @nest.Patch(":id")
    async update(
        @nest.Param("id") id: number,
        @nest.Body("key") key: string,
        @nest.Body("mimeType") mimeType: string,
        @nest.Body("content") content: string,
        @providers.User() user: db.User
    ) {
        const item = await CrudExecutor.getOne(this.db.mediaItems, id, user);
        await this.db.mediaItems.update(item.id, {
            key: key || item.key,
            mimeType: mimeType || item.mimeType,
            content: content ? new Buffer(content) : item.content
        });
        return { ok: true };
    }

    @nest.Delete(":id")
    async delete(
        @nest.Param("id") id: number,
        @providers.User() user: db.User
    ) {
        const item = await CrudExecutor.getOne(this.db.mediaItems, id, user);
        await this.db.mediaItems.delete(item);
        return { ok: true };
    }
}
