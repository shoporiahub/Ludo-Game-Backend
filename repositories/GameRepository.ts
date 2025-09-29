import { Game } from "../models/Game";

const games = new Map<string, Game>();

export const Persistence = {
  /** Save or update a game */
  saveGame(game: Game): Game {
    games.set(game.id, game);
    return game;
  },

  /** Retrieve a game by ID */
  getGame(gameId: string): Game | null {
    return games.get(gameId) || null;
  },

  /** List all games */
  listGames(): Game[] {
    return Array.from(games.values());
  },

  /** Delete a game */
  deleteGame(gameId: string): boolean {
    return games.delete(gameId);
  },
};
