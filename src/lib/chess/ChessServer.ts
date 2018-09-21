import * as nest from "@nestjs/common";
import { WebSocketGateway, SubscribeMessage } from "@nestjs/websockets";
import * as randomstring from "randomstring";
import * as db from "models";
import * as providers from "providers";
import * as Events from "./events";
import { Game } from "./Game";
import { Player } from "./Player";

@nest.Injectable()
@WebSocketGateway({ namespace: "chess" })
export class ChessServer {
    games: {[id: string]: Game} = {};
    constructor(
        readonly db: providers.Repositories
    ) { }

    @SubscribeMessage("join")
    async onJoin(socket: SocketIO.Socket, evt: Events.JoinEvent) {
        if (!evt.gameId || !this.games[evt.gameId] || this.games[evt.gameId].isFull) {
            const partialGameId = Object.keys(this.games).find(id => !this.games[id].isFull);
            evt.gameId = partialGameId || randomstring.generate(16);
            if (!partialGameId) this.games[evt.gameId] = new Game();
        }
        this.games[evt.gameId].addPlayer(new Player({
            game: this.games[evt.gameId],
            socket,
            user: (await db.User.getFromToken(this.db.users, evt.token)) as db.User
        }));
    }
}
