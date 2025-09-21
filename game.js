// Import game elements
import { ball, drawBall } from "./ball.js";
import { paddle, drawPaddle } from "./paddle.js";
import { bricks, generateBricks, drawBricks, handleLevelCompletion } from "./bricks.js";
import { brickCollisionDetection } from "./collision.js";
import { rightPressed, leftPressed } from "./game_input.js";
import { drawParticles } from "./bricks_animations.js";
import { drawScore, drawLives, checkAndUpdateHighScore } from "./extra_features.js";
import { backgroundsound,hitSound, paddleSound } from "./sound.js";

// CANVAS & CONTEXT SETUP 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// GAME STATE 
let gameState = {
    score: 0,
    lives: 3
};

// the start screen to intialize the game
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.font = "60px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("BRICK BREAKER", canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = "30px Arial";
    ctx.fillText("Click or Press Any Key to Start", canvas.width / 2, canvas.height / 2 + 20);
}

// INITIALIZATION 
// The init function runs only once when the game first loads. Its job is to set up the starting positions of all the game objects and then kick off the main game loop.
function init() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // to create the first level's brick layout.
    generateBricks(canvas); 

    drawStartScreen();
}

// MAIN GAME LOOP 
function draw() {
    // erases everything on the canvas. so yoy can't see ball pervious postions.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw every element in its new position for the current frame
    drawBricks(ctx);
    drawParticles(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    drawScore(ctx, gameState.score);
    drawLives(ctx, gameState.lives);
    backgroundsound();

    // update the score if the ball hit a brick and play a sound effect
    let scoreFromCollision = brickCollisionDetection(ball, bricks);
    if (scoreFromCollision > 0) {
        gameState.score += scoreFromCollision;
        checkAndUpdateHighScore(gameState.score);
        hitSound.play();
    }
    
    // checks if all bricks have been broken so you can advance to next level
    handleLevelCompletion(ball, paddle, canvas);

    // Paddle movement
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }

    // update ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Check for left and right wall collision
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    // Check for top wall collision
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
      // Check for bottom wall collision  
    } else if (ball.y + ball.dy > canvas.height - (ball.radius*2)) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) { // if it hit the paddle it reflect and play a sound
            ball.dy = -ball.dy;
            paddleSound.play();
        } else { // if it hit the bottom you lose a live
            gameState.lives--;
            if (gameState.lives <= 0) {
                alert("GAME OVER\nFinal Score: " + gameState.score); // game over with the score
                ball.dy *=-1; // ball moving up 
                document.location.reload(); // restart the game
            } else {
                // reset for the next try
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 50;
                paddle.x = (canvas.width - paddle.width) / 2;
                ball.dy *=-1; // ball moving up 
            }
        }
    }
    //updates and redraws one frame of the game.
    requestAnimationFrame(draw);
}


function startGame() {
    // Remove the event listeners so they don't run again.
    document.removeEventListener('keydown', startGame);
    document.removeEventListener('click', startGame);
    
    // Call draw() for the first time to kick off the animation loop.
    draw();
}

// run the intializing function
init();

document.addEventListener('keydown', startGame);
document.addEventListener('click', startGame);