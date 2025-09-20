// Import ball object and drawing function
import { ball, drawBall } from "./ball.js";
// Import brick data, init, draw, and particle functions
import { createParticles, drawBricks, drawParticles } from "./bricks_animations.js";

let canvas = document.getElementById('our-canvas');
let ctx = canvas.getContext('2d');

// --- INITIALIZATION ---
// Initialize ball position
ball.x = canvas.width / 2;
ball.y = canvas.height - 30;

// Initialize brick grid
initBricks();

// --- GAME OBJECTS ---
let paddle = {
    height: 15,
    width: 150,
    x: (canvas.width - 150) / 2,
    speed: 8
};

// --- GAME STATE ---
let score = 0;
let lives = 3;


// --- INPUT HANDLING ---
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
    else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
    else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    }
}


// --- COLLISION DETECTION ---
function brickCollisionDetection() {
    for (let c = 0; c < brickInfo.columnCount; c++) {
        for (let r = 0; r < brickInfo.rowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) { // Only check intact bricks
                if (ball.x > b.x && ball.x < b.x + brickInfo.width && ball.y > b.y && ball.y < b.y + brickInfo.height) {
                    ball.dy = -ball.dy;
                    b.status = 0; // Mark brick as broken
                    createParticles(b.x, b.y, b.color); // Spawn particles
                    score += 10;
                    if (score == brickInfo.rowCount * brickInfo.columnCount * 10) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}


// --- DRAWING FUNCTIONS ---
function drawPaddle() {
    ctx.beginPath();
    let paddleY = canvas.height - paddle.height;
    ctx.rect(paddle.x, paddleY, paddle.width, paddle.height);
    
    // Paddle glow effect
    ctx.shadowColor = '#00FFFF'; // Cyan glow
    ctx.shadowBlur = 25;       // Intensity of the blur
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.fillStyle = '#07050cff'; // Paddle color
    ctx.fill();
    ctx.closePath();

    // Reset shadow properties after drawing the paddle
    // IMPORTANT: Otherwise everything drawn after the paddle will also have a shadow.
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = 0;
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 30);
}

function drawLives() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 100, 30);
}


// --- MAIN GAME LOOP 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Drawing order matters: Draw particles first so they appear "behind" the ball and paddle.
       // Draw intact bricks
    drawParticles(ctx);     // Draw and update particle effects
    drawBall(ctx);          // Draw ball
    drawPaddle();           // Draw paddle (with glow)
    drawScore();
    drawLives();

    brickCollisionDetection();

    // Ball wall collision
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Ball hits bottom edge
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            // Bounce off paddle
            ball.dy = -ball.dy;
        } else {
            // Ball missed paddle - lose a life
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                // Reset ball and paddle
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 4;
                ball.dy = -4;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }

    // Paddle movement (keyboard)
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(draw);
}

draw(); // Start the game loop