import { Game } from "./Game";
import { PlayerColor } from "./PlayerColor";
import * as Events from "./events";

export class Player {
    color?: PlayerColor;
    readonly game!: Game;
    readonly id!: string;
    readonly socket!: SocketIO.Socket;
    constructor(init: Pick<Player, "game" | "id" | "socket">) {
        Object.assign(this, init);
        this.socket.on("move", this.onMove);
        this.socket.on("disconnect", this.onDisconnect);
        this.sendBoard();
    }

    sendBoard() {
        this.socket.emit("board", {
            fen: this.game.board.fen(),
            currentTurn: this.game.board.turn()
        });
    }

    private onDisconnect = () => {
        this.game.removePlayer(this);
    }

    private onMove = (evt: Events.MoveEvent) => {
        const success = this.game.board.turn() === this.color
            && this.game.move(evt.from, evt.to);
        if (!success) this.socket.emit("board:reset");
    };
}
