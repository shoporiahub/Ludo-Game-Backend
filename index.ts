import { GameController } from "./controllers/GameController";

const gameController = new GameController();

//  Create a new game
const createResult = gameController.createGame({ maxPlayers: 4, createdBy: "p1" });

if ("error" in createResult) {
  console.error("Failed to create game:", createResult.error);
  process.exit(1);
}

const game = createResult; // This is guaranteed to be a Game instance
console.log("Game created:", game);

//  Join a second player
const joinResult = gameController.joinGame({ gameId: game.id, playerId: "p2", name: "Alice" });

if ("error" in joinResult) {
  console.error("Failed to join game:", joinResult.error);
} else {
  console.log("After join:", joinResult);
}

//  Roll dice for the first player
const rollResult = gameController.rollDice({ gameId: game.id, playerId: "p1" });

if (!rollResult.success) {
  console.error("Dice roll failed:", rollResult.error);
} else {
  console.log("Dice rolled:", rollResult.value);
}
