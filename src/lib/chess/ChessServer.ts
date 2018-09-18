import { WebSocketGateway, SubscribeMessage } from "@nestjs/websockets";
import * as Events from "./events";
import { Game } from "./Game";

@WebSocketGateway({ namespace: "chess" })
export class ChessServer {
    games: {[id: string]: Game} = {};

    @SubscribeMessage("join")
    async onJoin(client: SocketIO.Client, evt: Events.JoinEvent) {
        if (!(evt.gameId && this.games[evt.gameId])) {
            this.games[];
        }
    }
}
