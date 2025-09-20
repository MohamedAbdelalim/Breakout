// Import game elements
import { ball, drawBall } from "./ball.js";
import { paddle, drawPaddle } from "./paddle.js";
// ✨ FIX: Updated the import list from bricks.js
import { bricks, generateBricks, drawBricks, handleLevelCompletion } from "./bricks.js";
import { brickCollisionDetection } from "./collision.js";
import { rightPressed, leftPressed } from "./game_input.js";
import { drawParticles } from "./bricks_animations.js";
import { drawScore, drawLives, checkAndUpdateHighScore } from "./extra_features.js";
import { backgroundsound,hitSound, paddleSound } from "./sound.js";

// --- CANVAS & CONTEXT SETUP ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// --- GAME STATE ---
let gameState = {
    score: 0,
    lives: 3
};

// --- INITIALIZATION ---
function init() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // ✨ FIX: Pass the canvas to generateBricks
    generateBricks(canvas); 
    draw(); 
}

// --- MAIN GAME LOOP ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks(ctx);
    drawParticles(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    drawScore(ctx, gameState.score);
    drawLives(ctx, gameState.lives);
    backgroundsound();

    let scoreFromCollision = brickCollisionDetection(ball, bricks);
    if (scoreFromCollision > 0) {
        gameState.score += scoreFromCollision;
        checkAndUpdateHighScore(gameState.score);
        hitSound.play();
    }
    
    // ✨ FIX: Pass ball, paddle, and canvas to the level handler
    handleLevelCompletion(ball, paddle, canvas);

    // Paddle movement
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }

    // Ball movement and physics... (rest of the code is the same)
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - (ball.radius*2)) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
            paddleSound.play();
        } else {
            gameState.lives--;
            if (gameState.lives <= 0) {
                alert("GAME OVER\nFinal Score: " + gameState.score);
                ball.dy *=-1;
                document.location.reload();
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 50;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }

    requestAnimationFrame(draw);
}

init();