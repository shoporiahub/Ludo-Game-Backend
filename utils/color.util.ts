import { PlayerColor } from "../dto/PlayerDTO";
import { Game } from "../models/Game";

export const allColors: PlayerColor[] = ["RED", "BLUE", "GREEN", "YELLOW"];

export function assignColor(game: Game): PlayerColor {
  const takenColors = game.players.map(p => p.color);
  const availableColor = allColors.find(c => !takenColors.includes(c));
  if (!availableColor) throw new Error("No colors available");
  return availableColor;
}
    