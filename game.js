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
const pauseBtn = document.getElementById('pause-btn');

// NEW: HTML UI Element References
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const highScoreEl = document.getElementById('highScore');

// Game state
let gameState = {
    score: 0,
    lives: 3,
    paused: false,
    rafId: null
};
let currentUser = null; // NEW: Store the user's name
let lastRunDisplayedLeaderboard = false;
let overlaySource = null; // 'pause' | 'gameover' | null
let hasActiveSession = false; // track if a game was started at least once

// Draw the start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "60px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("BRICK BREAKER", canvas.width / 2, canvas.height / 2 - 60);
    
    // NEW: Welcome the user by name
    ctx.font = "40px Arial";
    ctx.fillText(`Welcome, ${currentUser}!`, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.font = "30px Arial";
    ctx.fillText("Click or Press Any Key to Start", canvas.width / 2, canvas.height / 2 + 70);
}

// NEW: Resume prompt screen shown after overlays close
function drawResumeScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "60px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("Paused", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "30px Arial";
    ctx.fillText("Click or Press Any Key to Play", canvas.width / 2, canvas.height / 2 + 30);
}

// NEW: Function to update the HTML score bar
function updateUIBar() {
    scoreEl.textContent = `Score: ${gameState.score}`;
    levelEl.textContent = `Level: ${level}`;
    highScoreEl.textContent = `High Score: ${getHighScore(currentUser)}`;
}

// NEW: Helper to discover existing users from localStorage (by key prefix)
function listExistingUsers() {
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.startsWith('brickBreaker_') && k !== 'brickBreaker_leaderboard') {
            const name = k.replace('brickBreaker_', '');
            if (name) users.push(name);
        }
    }
    // Unique and sorted
    const unique = Array.from(new Set(users));
    unique.sort((a, b) => a.localeCompare(b));
    return unique;
}

function isValidUsername(name) {
    if (!name) return false;
    const trimmed = name.trim();
    if (!trimmed) return false;
    // Require at least one letter; allow letters and numbers
    const hasLetter = /[A-Za-z]/.test(trimmed);
    const validChars = /^[A-Za-z0-9]+$/.test(trimmed);
    return hasLetter && validChars;
}

// NEW: Start overlay: choose existing user or type a new username
function buildStartOverlayHTML() {
    const existing = listExistingUsers();
    const existingButtons = existing.map(u => `<button class="btn btn-info start-user-btn" data-user="${u}">${u}</button>`).join('');
    const existingBlock = existing.length ? `<div class="stack-buttons" style="margin-bottom:10px;">${existingButtons}</div>` : '';
    return `
        <div id="start-overlay" class="overlay">
            <div class="overlay-content">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <button id="start-back-btn" class="btn btn-info">\u2190 Back</button>
                </div>
                <h2>Welcome to Brick Breaker</h2>
                <p style="text-align:center; margin-top:0;">Choose a player or type a new username</p>
                ${existingBlock}
                <div class="stack-buttons">
                    <input id="start-new-user" type="text" placeholder="New username" style="padding:10px 12px; border-radius:10px; border:1px solid #ccc; outline:none; font-size:16px;" />
                    <button id="start-game-btn" class="btn btn-primary">Start Game</button>
                </div>
            </div>
        </div>`;
}

function showStartOverlay() {
    const existing = document.getElementById('start-overlay');
    if (existing) existing.remove();
    const container = document.createElement('div');
    container.innerHTML = buildStartOverlayHTML();
    document.body.appendChild(container.firstElementChild);

    let selectedUser = '';
    const backBtn = document.getElementById('start-back-btn');
    if (backBtn) backBtn.addEventListener('click', () => {
        const ov = document.getElementById('start-overlay');
        if (ov) ov.remove();
        showMainMenu();
    });
    const userButtons = document.querySelectorAll('.start-user-btn');
    userButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedUser = btn.getAttribute('data-user') || '';
            const input = document.getElementById('start-new-user');
            if (input) input.value = '';
            begin(); // immediately start with this existing user
        });
    });

    const startBtn = document.getElementById('start-game-btn');
    const inputEl = document.getElementById('start-new-user');
    function begin() {
        const typed = (inputEl && inputEl.value ? inputEl.value.trim() : '');
        const name = selectedUser || typed;
        if (!isValidUsername(name)) {
            alert('Invalid name. Please type letters or letters and numbers.');
            return;
        }
        currentUser = name.trim();
        updateUIBar();
        const ov = document.getElementById('start-overlay');
        if (ov) ov.remove();
        // Draw the welcome start screen then start on key/click
        drawStartScreen();
        document.addEventListener('keydown', startGame, { once: true });
        document.addEventListener('click', startGame, { once: true });
    }
    if (startBtn) startBtn.addEventListener('click', begin);
    if (inputEl) inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') begin(); });
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
        // MODIFIED: Pass currentUser to update high score
        checkAndUpdateHighScore(gameState.score, currentUser); 
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