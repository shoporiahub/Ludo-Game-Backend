import { GameService } from "../services/GameService";
import { CreateGameDTO } from "../dto/CreateGameDTO";
import { JoinGameDTO } from "../dto/JoinGameDTO";
import { RollDiceDTO } from "../dto/RollDiceDTO";
import { MoveTokenDTO } from "../dto/MoveTokenDTO";
import { Game } from "../models/Game";

export class GameController {
  private gameService = new GameService();

  /** Create a new game */
  async createGame(dto: CreateGameDTO): Promise<Game | { error: string }> {
    try {
      const game = await this.gameService.createGame(dto);
      return game;
    } catch (err: any) {
      return { error: err.message || "Failed to create game" };
    }
  }

  /** Join an existing game */
  async joinGame(dto: JoinGameDTO): Promise<Game | { error: string }> {
    try {
      const game = await this.gameService.joinGame(dto);
      return game;
    } catch (err: any) {
      return { error: err.message || "Failed to join game" };
    }
  }

  /** Roll dice for current player */
  async rollDice(dto: RollDiceDTO): Promise<{ success: boolean; value?: number; error?: string }> {
    try {
      const value = await this.gameService.rollDice(dto);
      return { success: true, value };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to roll dice" };
    }
  }

  /** Move a token */
  async moveToken(dto: MoveTokenDTO): Promise<{ success: boolean; game?: Game; error?: string }> {
    try {
      const game = await this.gameService.moveToken(dto);
      return { success: true, game };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to move token" };
    }
  }

  /** Get current game state */
  async getGame(gameId: string): Promise<Game | { error: string }> {
    try {
      const game = await this.gameService.getGame(gameId);
      return game;
    } catch (err: any) {
      return { error: err.message || "Game not found" };
    }
  }
}
