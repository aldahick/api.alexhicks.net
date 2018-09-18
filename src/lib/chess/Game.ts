import * as chess from "chess.js";
import { Player } from "./Player";
import { PlayerColor } from "./PlayerColor";

export class Game {
    board = new chess.Chess();
    players = [
        new Player(this, PlayerColor.White),
        new Player(this, PlayerColor.Black)
    ];

    get isFull() {
        return this.players.every(p => p.socket !== undefined);
    }

    move(from: chess.Square, to: chess.Square) {
        const move = this.board.move({ from, to });
        if (!move) return false;
        console.log(move, this.players.length);
        this.players.forEach(p => p.sendBoard());
        return true;
    }

    addPlayer(client: SocketIO.Socket) {
        const player = this.players.find(p => p.socket === undefined)!;
        player.init(client);
    }
}
