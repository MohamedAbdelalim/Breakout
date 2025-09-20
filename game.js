import * as Bricks from "./bricks.js";

Bricks.generateBricks(Bricks.brickRowCount, Bricks.brickColCount, Bricks.brickWidth, Bricks.brickHeight);
Bricks.drawBricks();
Bricks.drawTopBox();
Bricks.drawScoreBox(Bricks.score);