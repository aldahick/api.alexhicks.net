import { Game } from "./Game";
import { PlayerColor } from "./PlayerColor";
import * as Events from "./events";

export class Player {
    socket?: SocketIO.Socket;
    constructor(
        readonly game: Game,
        readonly color: PlayerColor
    ) { }

    init(socket: SocketIO.Socket) {
        this.socket = socket;
        this.socket.on("move", this.onMove);
        this.socket.on("disconnect", this.onDisconnect);
        this.sendBoard();
    }

    sendBoard() {
        this.emit("board", this.game.board.fen());
    }

    emit(type: string, data?: any) {
        if (!this.socket) return;
        this.socket.emit(type, data);
    }

    private onDisconnect = () => {
        this.socket = undefined;
    }

    private onMove = (evt: Events.MoveEvent) => {
        const success = this.game.board.turn() === this.color
            && this.game.move(evt.from, evt.to);
        if (!success) this.emit("board:reset");
    };
}
