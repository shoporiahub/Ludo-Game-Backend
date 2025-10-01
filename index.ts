import { GameController } from "./controllers/GameController";

const gameController = new GameController();

async function main() {
  try {
    // Create a new game
    const game = await gameController.createGame({ maxPlayers: 4, createdBy: "p1" });
    console.log("Game created:", game);

    // Join a second player
    const joinResult = await gameController.joinGame({ gameId: game.id, playerId: "p2", name: "Alice" });
    console.log("After join:", joinResult);

    // Roll dice for the first player
    const rollValue = await gameController.rollDice({ gameId: game.id, playerId: "p1" });
    console.log("Dice rolled:", rollValue);

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
