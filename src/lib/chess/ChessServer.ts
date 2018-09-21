import { WebSocketGateway, SubscribeMessage } from "@nestjs/websockets";
import * as randomstring from "randomstring";
import * as Events from "./events";
import { Game } from "./Game";

@WebSocketGateway({ namespace: "chess" })
export class ChessServer {
    games: {[id: string]: Game} = {};

    @SubscribeMessage("join")
    async onJoin(socket: SocketIO.Socket, evt: Events.JoinEvent) {
        if (!evt.gameId || !this.games[evt.gameId] || this.games[evt.gameId].isFull) {
            const partialGameId = Object.keys(this.games).find(id => !this.games[id].isFull);
            evt.gameId = partialGameId || randomstring.generate(16);
            if (!partialGameId) this.games[evt.gameId] = new Game();
        }
        this.games[evt.gameId].addPlayer(socket);
    }
}
