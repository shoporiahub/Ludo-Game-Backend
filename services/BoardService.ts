import { Token } from "../models/Token";
import { Player } from "../models/Player";
import { Game } from "../models/Game";
import { PlayerColor } from "../dto/PlayerDTO";

export interface BoardConfig {
  trackLength: number;
  homeStretchLength: number;
  startIndexForColor: Record<PlayerColor, number>;
  safeCells: number[];
}

export const DefaultBoardConfig: BoardConfig = {
  trackLength: 52,
  homeStretchLength: 6,
  startIndexForColor: {
    RED: 0,
    BLUE: 13,
    GREEN: 26,
    YELLOW: 39,
  },
  safeCells: [0, 8, 13, 21, 26, 34, 39, 47],
};

export class BoardService {
  constructor(private config: BoardConfig = DefaultBoardConfig) {}

  /** Get the start index for a player's color */
  getStartIndex(color: PlayerColor): number {
    return this.config.startIndexForColor[color];
  }

  /** Place a token on board from HOME */
  placeFromHome(token: Token, player: Player): void {
    const startIndex = this.getStartIndex(player.color);
    token.position = startIndex;
    token.isFinished = false;
  }

  /** Move token along the board */
  moveToken(token: Token, steps: number, player: Player, game: Game): { killed?: Token[]; finished?: boolean } {
    const result: { killed?: Token[]; finished?: boolean } = {};

    if (token.position === -1) {
      // Token is HOME
      throw new Error("Token must first enter the board with a dice roll of 6");
    }

    if (token.isFinished) {
      return result; // Already finished
    }

    let newPos = token.position + steps;
    const startIndex = this.getStartIndex(player.color);
    const pathLength = this.config.trackLength + this.config.homeStretchLength;

    // Check overshoot on home stretch
    if (newPos >= startIndex + pathLength) {
      return result; // Cannot move
    }

    // Finish condition
    if (newPos === startIndex + pathLength - 1) {
      token.position = -2; // special value to indicate FINISHED
      token.isFinished = true;
      result.finished = true;
      return result;
    }

    token.position = newPos % this.config.trackLength;

    // Check kills
    const kills = this.findKillTargets(token.position, game, player.id);
    if (kills.length > 0) {
      kills.forEach((t) => (t.position = -1)); // send back home
      result.killed = kills;
    }

    return result;
  }

  /** Find opponent tokens to kill at a position */
  findKillTargets(targetIndex: number, game: Game, excludingPlayerId: string): Token[] {
    const kills: Token[] = [];
    for (const p of game.players) {
      if (p.id === excludingPlayerId) continue;
      for (const t of p.tokens) {
        if (t.position === targetIndex && !this.isSafeCell(targetIndex)) {
          kills.push(t);
        }
      }
    }
    return kills;
  }

  /** Check if a cell is safe */
  isSafeCell(index: number): boolean {
    return this.config.safeCells.includes(index % this.config.trackLength);
  }
}
