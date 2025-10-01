import { Player } from "../models/Player";
import { Token } from "../models/Token";
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
  startIndexForColor: { RED: 0, BLUE: 13, GREEN: 26, YELLOW: 39 },
  safeCells: [0, 8, 13, 21, 26, 34, 39, 47],
};

export class BoardService {
  constructor(private config: BoardConfig = DefaultBoardConfig) {}

  getStartIndex(color: PlayerColor): number {
    return this.config.startIndexForColor[color];
  }

  placeFromHome(token: Token, player: Player) {
    token.position = this.getStartIndex(player.color);
    token.isFinished = false;
  }

  moveToken(token: Token, steps: number, player: Player, allPlayers: Player[]): { killed?: Token[]; finished?: boolean } {
    const result: { killed?: Token[]; finished?: boolean } = {};

    if (token.position === -1) throw new Error("Token must first enter the board with a dice roll of 6");
    if (token.isFinished) return result;

    const startIndex = this.getStartIndex(player.color);
    const pathLength = this.config.trackLength + this.config.homeStretchLength;
    let newPos = token.position + steps;

    if (newPos >= startIndex + pathLength) return result;

    if (newPos === startIndex + pathLength - 1) {
      token.position = -2;
      token.isFinished = true;
      result.finished = true;
      return result;
    }

    token.position = newPos % this.config.trackLength;

    // Check kills
    const kills: Token[] = [];
    for (const p of allPlayers) {
      if (p.id === player.id) continue;
      for (const t of p.tokens) {
        if (t.position === token.position && !this.isSafeCell(token.position)) {
          t.position = -1; // back home
          kills.push(t);
        }
      }
    }

    if (kills.length) result.killed = kills;
    return result;
  }

  isSafeCell(pos: number): boolean {
    return this.config.safeCells.includes(pos % this.config.trackLength);
  }
}
