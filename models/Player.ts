import { Token } from "./Token";
import { PlayerColor } from "../dto/PlayerDTO";

export class Player {
  public tokens: Token[] = [];

  constructor(
    public id: string,
    public name: string,
    public color: PlayerColor
  ) {
    // Initialize 4 tokens for the player
    this.tokens = Array.from({ length: 4 }).map(() => new Token());
  }
}
