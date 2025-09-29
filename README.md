Dice rolls

Random 1–6 via DiceService.roll()

Turn validation (only current player can roll)

Token movement

Move tokens along the board

Enter board from HOME only on 6 (BoardService.placeFromHome)

Track movement including home stretch

Prevent overshooting home stretch

Finish token when it reaches the end (isFinished)

Safe cells

Tokens on safe cells cannot be killed

Kills / Sending opponents home

Opponent tokens on the same cell (if not safe) are sent home

Turn management

Turns advance to the next player

Extra turn if player rolls 6

Win condition

Game finishes when a player completes all 4 tokens

Winner recorded in Game.winnerId

Persistence

In-memory game storage via Persistence