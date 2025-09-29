import { Player } from "./Player";

export enum GameStatus {
  WAITING = "WAITING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export class Game {
  constructor(
    public id: string,
    public players: Player[] = [],
    public status: GameStatus = GameStatus.WAITING,
    public currentTurnIndex: number = 0
  ) {}

  get currentPlayer(): Player {
    return this.players[this.currentTurnIndex];
  }
}
