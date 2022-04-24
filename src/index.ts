import { Apple, SnakeCell, TurnPoint } from "./classes";

const canvas = document.querySelector("canvas");
const cx = canvas!.getContext("2d");
const score = document.getElementById("score");
const highscore = document.getElementById("highscore");
const button = document.querySelector("button");

const sfxEat = new Audio("./assets/eat_apple.wav");
const sfxDie = new Audio("./assets/die.wav");

const WIDTH: number = 20;
const HEIGHT: number = 20;
let loop: any;
let maxApplesEaten: number = window.localStorage.getItem("maxApplesEaten")
  ? Number.parseInt(window.localStorage.getItem("maxApplesEaten")!)
  : 0;
highscore!.innerHTML = maxApplesEaten + "";

const NewGame = () => {
  const field: number[][] = Array.from(new Array(20), () =>
    Array.from(new Array(20), () => 0)
  );

  let apples: Apple[] = [
    new Apple(
      Math.floor(Math.random() * HEIGHT),
      Math.floor(Math.random() * WIDTH)
    )
  ];
  const snake: SnakeCell[] = [new SnakeCell(4, 9, "d")];
  const turnpoints: TurnPoint[] = [];
  let applesEaten: number = 0;
  score!.innerHTML = applesEaten + "";

  loop = setInterval(() => {
    const head = snake[0];
    field.forEach(row => row.fill(0));

    snake.forEach((cell: SnakeCell, i: number) => {
      field[cell.x][cell.y] = 1;
      turnpoints.forEach((turnpoint, k) => {
        if (cell.x === turnpoint.x && cell.y === turnpoint.y) {
          cell.direction = turnpoint.direction;
          if (i === snake.length - 1) {
            turnpoints.splice(k, 1);
          }
        }
      });
    });

    apples.forEach((apple, i) => {
      field[apple.x][apple.y] = 2;
      snake.forEach(cell => {
        if (apple.y === cell.y && apple.x === cell.x) {
          sfxEat.play();
          apples.splice(i, 1);
          apples.push(
            new Apple(
              Math.floor(Math.random() * HEIGHT),
              Math.floor(Math.random() * WIDTH)
            )
          );
          score!.innerHTML = ++applesEaten + "";
          maxApplesEaten = Math.max(applesEaten, maxApplesEaten);
          highscore!.innerHTML = maxApplesEaten + "";
          let last = snake[snake.length - 1];
          let offset = [0, 0];
          switch (last.direction) {
            case "w":
              break;
            case "a":
              offset = [1, 0];
              break;
            case "s":
              offset = [0, -1];
              break;
            case "d":
              offset = [-1, 0];
              break;
          }
          snake.push(
            new SnakeCell(
              last.x + offset[0],
              last.y + offset[1],
              last.direction
            )
          );
        }
      });
    });

    snake.forEach((cell, i) => {
      switch (cell.direction) {
        case "w":
          cell.y--;
          break;
        case "a":
          cell.x--;
          break;
        case "s":
          cell.y++;
          break;
        case "d":
          cell.x++;
          break;
      }
      if (cell.x < 0) {
        cell.x = WIDTH + cell.x;
      } else if (cell.y < 0) {
        cell.y = HEIGHT + cell.y;
      } else if (cell.x + 1 > WIDTH) {
        cell.x = 0;
      } else if (cell.y + 1 > HEIGHT) {
        cell.y = 0;
      }
      if (cell.x === head.x && cell.y === head.y && i !== 0) {
        //@ts-ignore
        LoseGame(loop);
      }
    });

    cx!.fillRect(0, 0, canvas!.width, canvas!.height);
    for (let i = 0; i < HEIGHT; i++) {
      for (let k = 0; k < WIDTH; k++) {
        if (field[i][k] === 0) {
          cx!.fillStyle = "BLACK";
        } else if (field[i][k] === 1) {
          cx!.fillStyle = "GREEN";
        } else {
          cx!.fillStyle = "RED";
        }
        cx!.fillRect(i * 32, k * 32, 32, 32);
        cx!.fillStyle = "AQUA";
        cx!.fillRect(head.x * 32, head.y * 32, 32, 32);

        cx!.strokeStyle = "WHITE";
        cx!.strokeRect(i * 32, k * 32, 32, 32);
      }
    }
  }, 100);

  window.addEventListener("keydown", event => {
    switch (event.key) {
      case "w":
        if (snake.length === 1 || snake[0].direction !== "s") {
          turnpoints.push(new TurnPoint(snake[0].x, snake[0].y, "w"));
        }
        break;
      case "a":
        if (snake.length === 1 || snake[0].direction !== "d") {
          turnpoints.push(new TurnPoint(snake[0].x, snake[0].y, "a"));
        }
        break;
      case "s":
        if (snake.length === 1 || snake[0].direction !== "w") {
          turnpoints.push(new TurnPoint(snake[0].x, snake[0].y, "s"));
        }
        break;
      case "d":
        if (snake.length === 1 || snake[0].direction !== "a") {
          turnpoints.push(new TurnPoint(snake[0].x, snake[0].y, "d"));
        }
        break;
    }
  });
};

const LoseGame = (loop: number) => {
  sfxDie.play();
  window.localStorage.setItem("maxApplesEaten", maxApplesEaten + "");
  clearInterval(loop);
};

button!.addEventListener("click", () => {
  clearInterval(loop);
  NewGame();
});
