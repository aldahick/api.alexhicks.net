import * as nest from "@nestjs/common";
import { ChessServer } from "lib/chess";

@nest.Injectable()
@nest.Controller("chess")
export class ChessController {
    constructor(
        readonly server: ChessServer
    ) { }

    @nest.Get("games")
    games() {
        return {
            games: Object.keys(this.server.games).filter(key =>
                this.server.games[key].isActive &&
                !this.server.games[key].isFull
            )
        };
    }
}
