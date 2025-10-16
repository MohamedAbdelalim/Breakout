import {ball} from "./ball.js";

//  Handle Bricks and multi-levels

let level = 1;
let brickRowCount = 4;
let brickColCount = 5;
let speed =5;

export let bricks = []; // The main array holding the brick objects


// generateBricks is responsible for creating bricks with random gaps and assigning random bright colors, depending on the canvas width.
export function generateBricks(canvas) {
    bricks.length = 0;  // Clear the old bricks

    const brickWidth = canvas.width / brickColCount;
    const brickHeight = canvas.height / 20;
    const paddingTop = 100; // Space from the top reserved for score, high score, lives, and level display


    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColCount; c++) {

            // Create bricks with 80% probability to introduce random gaps
            if (Math.random() < 0.8) {
                let x = c * brickWidth;
                let y = r * brickHeight;

                // Use bright colors (skip dark colors for better contrast with background)
                let red = Math.floor(Math.random() * 200) + 55;
                let green = Math.floor(Math.random() * 200) + 55;
                let blue = Math.floor(Math.random() * 200) + 55;

                // Store the brick (with its random color) in the array for later drawing.
                bricks.push({
                    x: x,
                    y: y + paddingTop,
                    width: brickWidth,
                    height: brickHeight,
                    alive: true,
                    color: `rgb(${red}, ${green}, ${blue})`,
                });
            }
        }
    }
}


//The drawBricks function is responsible for: 
// - Displaying the current level number at the top of the canvas.
// - Drawing the colored bricks for the current level with a small border effect.
export function drawBricks(ctx) {

    ctx.font = "24px Arial";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "center";
    // ctx.fillText("Level: " + level, canvas.width/2, 30);

    for (const brick of bricks) {
        if (brick.alive) {
            const brickWidth = brick.width; 
            const brickHeight = brick.height;
            ctx.fillStyle = brick.color;

            // Draw with a small gap to create a border effect
            ctx.fillRect(brick.x + 2, brick.y + 2, brickWidth - 4, brickHeight - 4);
        }
    }
}

// The startNextLevel function is responsible for:
// - Moving the game to the next level by increasing the difficulty.
// - Resetting the ball's speed and direction.
// - Regenerating the brick grid for the new level by increasing the number of brick rows (early levels) or columns (later levels).

function startNextLevel(canvas) {
    level++;
    
    // Increase difficulty by adding rows or columns
    if (level <= 2) {
        brickRowCount++;

    } else {
        brickColCount += 2;
        
    }

    ball.dx = speed;
    ball.dy = -speed;
    speed++;
    generateBricks(canvas);
}


 // The handleLevelCompletion function is responsible for:
 // -Checking if all the bricks in the current level are destroyed.
 // -If so, it shows a "Level Complete" alert and starts the next level.
 // -Regenerates the brick layout for the new level.
 // -Resets the ball position to the center and the paddle position to the middle.

export function handleLevelCompletion(ball, paddle, canvas) {
    // Check if there are any living bricks left
    const allBroken = bricks.every(brick => !brick.alive);

    if (allBroken) {
        alert("Level " + level + " Complete!");
        startNextLevel(canvas);
        
        // Reset ball and paddle position for the new level
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
        paddle.x = (canvas.width - paddle.width) / 2;
    }
}