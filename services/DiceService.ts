import { Dice } from "../models/Dice";

export class DiceService {
  private dice = new Dice();

  roll(): number {
    return this.dice.roll();
  }
}
