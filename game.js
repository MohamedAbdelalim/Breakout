// Import game elements
import { ball, drawBall } from "./ball.js";
import { paddle, drawPaddle } from "./paddle.js";
import { 
    bricks, 
    generateBricks, 
    drawBricks, 
    handleLevelCompletion, 
    spawnPowerUp, 
    drawPowerUps, 
    updatePowerUps 
} from "./bricks.js";
import { brickCollisionDetection } from "./collision.js";
import { rightPressed, leftPressed } from "./game_input.js";
import { drawParticles } from "./bricks_animations.js";
import { 
    updateScoreDisplay, 
    updateLivesDisplay, 
    checkAndUpdateHighScore,
    showGameOverModal
} from "./extra_features.js";
import { backgroundsound, hitSound, paddleSound } from "./sound.js";

// Canvas and context setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = {
    score: 0,
    lives: 3
};

// Draw the start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "60px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("BRICK BREAKER", canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = "30px Arial";
    ctx.fillText("Click or Press Any Key to Start", canvas.width / 2, canvas.height / 2 + 20);
}

// Initialize the game
function init() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    generateBricks(canvas); 
    drawStartScreen();
}

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawBricks(ctx, canvas);
    drawParticles(ctx);
    drawPowerUps(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    updateScoreDisplay(gameState.score);
    updateLivesDisplay(gameState.lives);
    backgroundsound();

    // Handle brick collisions
    let scoreFromCollision = brickCollisionDetection(ball, bricks);

    if (scoreFromCollision > 0) {
        gameState.score += scoreFromCollision;
        checkAndUpdateHighScore(gameState.score);
        hitSound.play();
        
        // Spawn power-ups for newly broken bricks
        for (const brick of bricks) {
            if (!brick.alive && !brick.checked) {
                brick.checked = true;
                spawnPowerUp(brick);
            }
        }
    }
    
    handleLevelCompletion(ball, paddle, canvas);

    // Move paddle based on input
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Handle ball collisions with walls
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - (ball.radius * 2)) {
        // Check for paddle collision
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
            paddleSound.play();
        } else {
            // Lose a life
            gameState.lives--;
            if (gameState.lives <= 0) {
                showGameOverModal(gameState.score);
                return; // Stop the game loop
            } else {
                // Reset ball and paddle
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 50;
                paddle.x = (canvas.width - paddle.width) / 2;
                ball.dy *= -1;
            }
        }
    }

    updatePowerUps(paddle, canvas, gameState);

    requestAnimationFrame(draw);
}

// Start the game on user input
function startGame() {
    document.removeEventListener('keydown', startGame);
    document.removeEventListener('click', startGame);
    draw();
}

// Initialize and set up event listeners
init();
document.addEventListener('keydown', startGame);
document.addEventListener('click', startGame);