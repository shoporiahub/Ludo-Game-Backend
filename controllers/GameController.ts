import { GameService } from "../services/GameService";
import { CreateGameDTO } from "../dto/CreateGameDTO";
import { JoinGameDTO } from "../dto/JoinGameDTO";
import { RollDiceDTO } from "../dto/RollDiceDTO";
import { MoveTokenDTO } from "../dto/MoveTokenDTO";

export class GameController {
  private gameService = new GameService();

  /** Create a new game */
  createGame(dto: CreateGameDTO) {
    try {
      return this.gameService.createGame(dto);
    } catch (err: any) {
      return { error: err.message || "Failed to create game" };
    }
  }

  /** Join an existing game */
  joinGame(dto: JoinGameDTO) {
    try {
      return this.gameService.joinGame(dto);
    } catch (err: any) {
      // Friendly error for full game or invalid state
      return { error: err.message || "Failed to join game" };
    }
  }

  /** Roll dice for current player */
  rollDice(dto: RollDiceDTO) {
    try {
      const value = this.gameService.rollDice(dto);
      return { success: true, value };
    } catch (err: any) {
      return { error: err.message || "Failed to roll dice" };
    }
  }

  /** Move a token */
  moveToken(dto: MoveTokenDTO) {
    try {
      const game = this.gameService.moveToken(dto);
      return { success: true, game };
    } catch (err: any) {
      return { error: err.message || "Failed to move token" };
    }
  }

  /** Get current game state */
  getGame(gameId: string) {
    try {
      return this.gameService.getGame(gameId);
    } catch (err: any) {
      return { error: err.message || "Game not found" };
    }
  }
}
