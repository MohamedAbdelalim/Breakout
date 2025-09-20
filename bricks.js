import {ball} from "./ball.js";
// --- BRICK & LEVEL STATE ---
let level = 1;
let brickRowCount = 5;
let brickColCount = 10;
let speed =5;

export let bricks = []; // The main array holding the brick objects

/**
 * Generates a new grid of bricks for the current level.
 * @param {HTMLCanvasElement} canvas The main game canvas.
 */
export function generateBricks(canvas) {
    bricks.length = 0; // Clear the old bricks

    const brickWidth = canvas.width / brickColCount;
    const brickHeight = canvas.height / 20;
    const paddingTop = 100; // Space from the top for the score/level text

    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColCount; c++) {
            // Randomly skip creating some bricks to create gaps
            if (Math.random() < 0.8) {
                let x = c * brickWidth;
                let y = r * brickHeight;

                // Generate a random bright color for each brick
                let red = Math.floor(Math.random() * 200) + 55;
                let green = Math.floor(Math.random() * 200) + 55;
                let blue = Math.floor(Math.random() * 200) + 55;

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

/**
 * Draws all living bricks onto the canvas.
 * @param {CanvasRenderingContext2D} ctx The canvas context.
 */
export function drawBricks(ctx) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "center";

    ctx.fillText("Level: " + level, canvas.width/2, 30);
    for (const brick of bricks) {
        if (brick.alive) {
            const brickWidth = brick.width; // Use the width stored in the brick
            const brickHeight = brick.height;
            ctx.fillStyle = brick.color;
            // Draw with a small gap to create a border effect
            ctx.fillRect(brick.x + 2, brick.y + 2, brickWidth - 4, brickHeight - 4);
        }
    }
}

/**
 * Starts the next level by increasing difficulty and regenerating bricks.
 * @param {HTMLCanvasElement} canvas The main game canvas.
 */
function startNextLevel(canvas) {
    level++;
    
    // Increase difficulty by adding rows or columns
    if (level <= 4) {
        brickRowCount++;

    } else {
        brickColCount += 2;
        
    }
    ball.dx = speed;
    ball.dy = -speed;
    // console.log(ball.dx,ball.dy);
    speed++;
    generateBricks(canvas);
}

/**
 * Checks if all bricks are broken and starts the next level if they are.
 * @param {object} ball The game ball object.
 * @param {object} paddle The game paddle object.
 * @param {HTMLCanvasElement} canvas The main game canvas.
 */
export function handleLevelCompletion(ball, paddle, canvas) {
    // Check if there are any living bricks left
    const allBroken = bricks.every(brick => !brick.alive);

    if (allBroken && bricks.length > 0) {
        alert("Level " + level + " Complete!");
        startNextLevel(canvas);
        
        // Reset ball and paddle position for the new level
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
        paddle.x = (canvas.width - paddle.width) / 2;
    }
}