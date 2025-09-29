import { GameController } from "./controllers/GameController";

const gameController = new GameController();

// Example usage
const game = gameController.createGame({ maxPlayers: 4, createdBy: "p1" });
console.log("Game created:", game);

gameController.joinGame({ gameId: game.id, playerId: "p2", name: "Alice" });
console.log("After join:", game);

const roll = gameController.rollDice({ gameId: game.id, playerId: "p1" });
console.log("Dice rolled:", roll);
