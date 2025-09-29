import { PlayerColor } from "./PlayerDTO";

export interface JoinGameDTO {
  gameId: string;
  playerId: string;
  name: string;
  color?: PlayerColor; // optional if you want the player to choose color

}
