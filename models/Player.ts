import { Token } from "./Token";

export class Player {
  constructor(
    public id: string,
    public name: string,
    public tokens: Token[] = []
  ) {}
}
