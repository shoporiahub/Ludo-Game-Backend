import { Game, GameStatus } from "../models/Game";
import { Player } from "../models/Player";
import { Token } from "../models/Token";
import { DiceService } from "./DiceService";
import { BoardService } from "./BoardService";
import { Persistence } from "../repositories/GameRepository";
import { CreateGameDTO } from "../dto/CreateGameDTO";
import { JoinGameDTO } from "../dto/JoinGameDTO";
import { MoveTokenDTO } from "../dto/MoveTokenDTO";
import { RollDiceDTO } from "../dto/RollDiceDTO";
import { assignColor } from "../utils/color.util";
import { generateId } from "../utils/IdGenerator";

export class GameService {
  private diceService = new DiceService();
  private boardService = new BoardService();

  /** Create a new game */
  createGame(dto: CreateGameDTO): Game {
    const game = new Game(generateId("game_"));
    game.status = GameStatus.WAITING;
    game.currentTurnIndex = 0;
    game.players = [];
    Persistence.saveGame(game);
    return game; // Game instance with unique id
  }

  /** Join an existing game */
  joinGame(dto: JoinGameDTO): Game {
    const game = Persistence.getGame(dto.gameId);
    if (!game) throw new Error("Game not found");
    if (game.players.length >= 4) throw new Error("Game is full");

    // Automatically assign color if not provided
    const color = dto.color || assignColor(game);

    // Create player and 4 tokens
    const player = new Player(dto.playerId, dto.name, color);
    player.tokens = Array.from({ length: 4 }).map(() => new Token(generateId("token_")));

    game.players.push(player);

    Persistence.saveGame(game);
    return game;
  }

  /** Start the game */
  startGame(gameId: string): Game {
    const game = Persistence.getGame(gameId);
    if (!game) throw new Error("Game not found");
    if (game.players.length < 2) throw new Error("Need at least 2 players");
    game.status = GameStatus.IN_PROGRESS;
    return game;
  }

  /** Roll dice for current player */
  rollDice(dto: RollDiceDTO): number {
    const game = Persistence.getGame(dto.gameId);
    if (!game) throw new Error("Game not found");

    const player = game.players[game.currentTurnIndex];
    if (player.id !== dto.playerId) throw new Error("Not your turn");

    return this.diceService.roll();
  }

  /** Move a token after dice roll */
  moveToken(dto: MoveTokenDTO): Game {
    const game = Persistence.getGame(dto.gameId);
    if (!game) throw new Error("Game not found");

    const player = game.players[game.currentTurnIndex];
    if (player.id !== dto.playerId) throw new Error("Not your turn");

    const token = player.tokens.find((t) => t.id === dto.tokenId);
    if (!token) throw new Error("Token not found");

    // If token is HOME, must roll 6 first
    if (token.position === -1) {
      if (dto.steps !== 6) throw new Error("Can only leave HOME on a 6");
      this.boardService.placeFromHome(token, player);
    } else {
      this.boardService.moveToken(token, dto.steps, player, game);
    }

    // Check win condition
    if (player.tokens.every((t) => t.isFinished)) {
      game.status = GameStatus.FINISHED;
      game.winnerId = player.id;
    } else {
      // Advance turn unless rolled a 6
      if (dto.steps !== 6) {
        game.currentTurnIndex = (game.currentTurnIndex + 1) % game.players.length;
      }
    }

    Persistence.saveGame(game);
    return game;
  }

  /** Get game state */
  getGame(gameId: string): Game {
    const game = Persistence.getGame(gameId);
    if (!game) throw new Error("Game not found");
    return game;
  }
}
