import { DiceService } from "./DiceService";
import { BoardService } from "./BoardService";
import { PlayerColor } from "../dto/PlayerDTO";
import { CreateGameDTO } from "../dto/CreateGameDTO";
import { JoinGameDTO } from "../dto/JoinGameDTO";
import { MoveTokenDTO } from "../dto/MoveTokenDTO";
import { RollDiceDTO } from "../dto/RollDiceDTO";

import { DiceRollRepository } from "../repositories/diceRoll.repository";
import { GamePlayerRepository } from "../repositories/gamePlayer.repository";
import { GameRepository } from "../repositories/game.repository";
import { PlayerRepository } from "../repositories/palyer.repository";
import { TokenMoveRepository } from "../repositories/tokenMove.repository";
import { TokenRepository } from "../repositories/token.repository";

export class GameService {
  private diceService = new DiceService();
  private boardService = new BoardService();

  /** Create a new game */
  async createGame(dto: CreateGameDTO) {
    const game = await GameRepository.create(dto.createdBy, dto.maxPlayers);
    return game;
  }

  /** Join an existing game */
  async joinGame(dto: JoinGameDTO) {
    const game = await GameRepository.findById(dto.gameId);
    if (!game) throw new Error("Game not found");

    if ((game.players?.length || 0) >= game.maxPlayers) throw new Error("Game is full");

    const color: PlayerColor = dto.color || this.assignColor(game.players || []);

    // Create player
    const player = await PlayerRepository.create(dto.name);

    // Add player to game
    await GamePlayerRepository.create(game.id, player.id, color, game.players.length || 0);

    // Create 4 tokens for player
    for (let i = 0; i < 4; i++) {
      await TokenRepository.create(game.id, player.id, -1); // -1 means HOME
    }

    return GameRepository.findById(game.id);
  }

  /** Roll dice for a player */
  async rollDice(dto: RollDiceDTO) {
    const game = await GameRepository.findById(dto.gameId);
    if (!game) throw new Error("Game not found");

    // Get current player based on turn index
    const currentTurnIndex = game.currentTurnIndex || 0;
    const currentPlayerId = game.players[currentTurnIndex].playerId;
    if (currentPlayerId !== dto.playerId) throw new Error("Not your turn");

    const value = this.diceService.roll();
    await DiceRollRepository.create(game.id, dto.playerId, value);

    return value;
  }

  /** Move a token */
 /** Move a token */
async moveToken(dto: MoveTokenDTO) {
  // Fetch the game
  const game = await GameRepository.findById(dto.gameId);
  if (!game) throw new Error("Game not found");

  // Fetch all tokens for the player
  const playerTokens = await TokenRepository.findByPlayerId(dto.playerId);
  const token = playerTokens.find(t => t.id === dto.tokenId);
  if (!token) throw new Error("Token not found");

  // Find the player in game.players to get full info
  const playerFromGame = game.players.find(p => p.playerId === dto.playerId);
  if (!playerFromGame) throw new Error("Player not found in game");

  // Construct full Player object for BoardService
  const playerObj = {
    id: playerFromGame.playerId,
    name: playerFromGame.name,
    color: token.playerColor,
    tokens: playerTokens,
    createdAt: playerFromGame.createdAt, // if required
    // Add other fields from Player model if necessary
  };

  // Load all players with their tokens
  const allPlayers = await this.loadAllPlayerTokens(game.players);

  // Move token using BoardService
  const result = this.boardService.moveToken(token, dto.steps, playerObj as any, { players: allPlayers } as any);

  // Update token in DB
  await TokenRepository.updatePosition(token.id, token.position, token.isFinished);

  // Handle killed tokens
  if (result.killed) {
    for (const killedToken of result.killed) {
      await TokenRepository.updatePosition(killedToken.id, killedToken.position, false);
    }
  }

  // Handle finished token / win
  if (result.finished) {
    await GameRepository.updateWinner(game.id, dto.playerId);
  }

  // Return updated game
  return GameRepository.findById(game.id);
}



  /** Get game state */
  async getGame(gameId: string) {
    const game = await GameRepository.findById(gameId);
    if (!game) throw new Error("Game not found");
    return game;
  }

  /** Helper to assign a color to a joining player */
  private assignColor(players: any[]): PlayerColor {
    const colors: PlayerColor[] = ["RED", "BLUE", "GREEN", "YELLOW"];
    for (const color of colors) {
      if (!players.some(p => p.color === color)) return color;
    }
    return "RED";
  }

  /** Helper to load all players' tokens */
  private async loadAllPlayerTokens(players: any[]) {
    const allPlayers = [];
    for (const p of players) {
      const tokens = await TokenRepository.findByPlayerId(p.playerId);
      allPlayers.push({ ...p, tokens });
    }
    return allPlayers;
  }
}
