import { CreateGameDTO } from "../dto/CreateGameDTO";
import { JoinGameDTO } from "../dto/JoinGameDTO";
import { RollDiceDTO } from "../dto/RollDiceDTO";
import { MoveTokenDTO } from "../dto/MoveTokenDTO";
import { GameService } from "../services/GameService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Game type
type PrismaGame = Awaited<ReturnType<typeof prisma.game.findUnique>>;


export class GameController {
  private gameService = new GameService();

  /** Create a new game */
  async createGame(dto: CreateGameDTO): Promise<PrismaGame> {
    const game = await this.gameService.createGame(dto);
    if (!game) throw new Error("Failed to create game");
    return game;
  }

  /** Join an existing game */
  async joinGame(dto: JoinGameDTO): Promise<PrismaGame> {
    const game = await this.gameService.joinGame(dto);
    if (!game) throw new Error("Failed to join game");
    return game;
  }

  /** Roll dice for a player */
  async rollDice(dto: RollDiceDTO): Promise<number> {
    const value = await this.gameService.rollDice(dto);
    return value;
  }

  /** Move a token */
  async moveToken(dto: MoveTokenDTO): Promise<PrismaGame> {
    const game = await this.gameService.moveToken(dto);
    return game;
  }

  /** Get game state */
  async getGame(gameId: string): Promise<PrismaGame> {
    const game = await this.gameService.getGame(gameId);
    if (!game) throw new Error("Game not found");
    return game;
  }
}
