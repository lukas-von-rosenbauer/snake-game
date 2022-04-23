export class Apple {
  public y: number;
  public x: number;
  constructor(y: number, x: number) {
    this.y = y;
    this.x = x;
  }
}

export class SnakeCell {
  public y: number;
  public x: number;
  public direction: string;
  constructor(x: number, y: number, direction: string) {
    this.y = y;
    this.x = x;
    this.direction = direction;
  }
}

export class TurnPoint {
  public y: number;
  public x: number;
  public direction: string;
  constructor(x: number, y: number, direction: string) {
    this.y = y;
    this.x = x;
    this.direction = direction;
  }
}
