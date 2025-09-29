import { Player } from "./Player";

export enum GameStatus {
  WAITING = "WAITING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export class Game {
  public players: Player[] = [];
  public status: GameStatus = GameStatus.WAITING;
  public currentTurnIndex: number = 0;
  public winnerId?: string;

  constructor(
    public id: string,
    players?: Player[],
    status?: GameStatus,
    currentTurnIndex?: number
  ) {
    if (players) this.players = players;
    if (status) this.status = status;
    if (currentTurnIndex !== undefined) this.currentTurnIndex = currentTurnIndex;
  }

  /** Returns the player whose turn it is */
  get currentPlayer(): Player | null {
    if (this.players.length === 0) return null;
    return this.players[this.currentTurnIndex];
  }

  /** Check if the game is finished */
  isFinished(): boolean {
    return this.status === GameStatus.FINISHED;
  }
}
