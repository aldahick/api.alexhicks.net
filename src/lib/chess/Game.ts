import * as chess from "chess.js";
import { Player } from "./Player";
import { PlayerColor } from "./PlayerColor";

export class Game {
    readonly board = new chess.Chess();
    private readonly players: Player[] = [];

    get isFull() {
        return this.players.length >= 2;
    }

    move(from: chess.Square, to: chess.Square) {
        // if (!this.isFull) return false;
        const move = this.board.move({ from, to, promotion: "q" });
        if (!move) return false;
        this.players.forEach(p => p.sendBoard());
        return true;
    }

    addPlayer(player: Player) {
        player.color = this.players.length === 0
            ? PlayerColor.White : PlayerColor.Black;
        this.players.push(player);
    }

    removePlayer(player: Player) {
        this.players.splice(this.players.findIndex(p => p.id === player.id), 1);
    }
}
