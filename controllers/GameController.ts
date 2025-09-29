import { GameService } from "../services/GameService";
import { CreateGameDTO } from "../dto/CreateGameDTO";
import { JoinGameDTO } from "../dto/JoinGameDTO";
import { RollDiceDTO } from "../dto/RollDiceDTO";
import { MoveTokenDTO } from "../dto/MoveTokenDTO";
import { Game } from "../models/Game";

export class GameController {
  private gameService = new GameService();

  /** Create a new game */
  createGame(dto: CreateGameDTO): Game | { error: string } {
    try {
      const game: Game = this.gameService.createGame(dto);
      return game;
    } catch (err: any) {
      return { error: err.message || "Failed to create game" };
    }
  }

  /** Join an existing game */
  joinGame(dto: JoinGameDTO): Game | { error: string } {
    try {
      const game: Game = this.gameService.joinGame(dto);
      return game;
    } catch (err: any) {
      return { error: err.message || "Failed to join game" };
    }
  }

  /** Start a game once enough players have joined */
  startGame(dto: { gameId: string }): Game | { error: string } {
    try {
      const game: Game = this.gameService.startGame(dto.gameId);
      return game;
    } catch (err: any) {
      return { error: err.message || "Failed to start game" };
    }
  }

  /** Roll dice for current player */
  rollDice(dto: RollDiceDTO): { success: boolean; value?: number; error?: string } {
    try {
      const value = this.gameService.rollDice(dto);
      return { success: true, value };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to roll dice" };
    }
  }

  /** Move a token */
  moveToken(dto: MoveTokenDTO): { success: boolean; game?: Game; error?: string } {
    try {
      const game: Game = this.gameService.moveToken(dto);
      return { success: true, game };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to move token" };
    }
  }

  /** Get current game state */
  getGame(gameId: string): Game | { error: string } {
    try {
      const game: Game = this.gameService.getGame(gameId);
      return game;
    } catch (err: any) {
      return { error: err.message || "Game not found" };
    }
  }
}
