import * as nest from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as providers from "../providers";
import * as db from "../models";

@nest.Injectable()
@nest.Controller("media")
export class MediaController {
    constructor(
        private readonly db: providers.Repositories
    ) { }

    @nest.Get()
    @nest.UseGuards(AuthGuard("bearer"))
    async getAll(
        @providers.User() user: db.User
    ) {
        return {
            mediaItems: await this.db.mediaItems.find({
                user: { id: user.id }
            })
        };
    }

    @nest.Get(":id")
    async getOne(
        @nest.Param("id") id: string,
        @providers.User() user: db.User
    ) {
        const mediaItem = await this.db.mediaItems.findOne({
            where: { id },
            ...db.User.join<db.MediaItem>()
        });
        if (!mediaItem) throw new nest.NotFoundException();
        if (mediaItem.user.id !== user.id) throw new nest.UnauthorizedException();
        return { mediaItem };
    }
}
