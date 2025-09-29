export class Token {
  constructor(
    public id: string,
    public position: number = -1, // -1 means in base
    public isFinished: boolean = false
  ) {}
}
