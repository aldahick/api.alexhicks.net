import { Game } from "./Game";
import { PlayerColor } from "./PlayerColor";
import * as Events from "./events";

export class Player {
    socket!: SocketIO.Socket;
    constructor(
        readonly game: Game,
        readonly color: PlayerColor
    ) { }

    init(socket: SocketIO.Socket) {
        this.socket = socket;
        this.socket.on("move", (evt: Events.MoveEvent) => {
            const success = this.game.board.turn() === this.color
                && this.game.move(evt.from, evt.to);
            console.log("move", evt, success);
            if (!success) this.socket.emit("board:reset");
        });
        this.sendBoard();
    }

    sendBoard() {
        this.socket.emit("board", this.game.board.fen());
    }
}
