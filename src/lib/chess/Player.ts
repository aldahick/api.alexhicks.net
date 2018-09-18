import { Game } from "./Game";
import { PlayerColor } from "./PlayerColor";

export class Player {
    constructor(
        private readonly game: Game,
        public readonly color: PlayerColor
    ) { }
}
