import { ball, drawBall } from "./ball.js";
import { paddle, drawPaddle } from "./paddle.js";
// MODIFIED: Import 'level' from bricks.js
import { bricks, generateBricks, drawBricks, handleLevelCompletion, level, resetToLevelOne } from "./bricks.js";
import { brickCollisionDetection } from "./collision.js";
import { rightPressed, leftPressed } from "./game_input.js";
import { drawParticles } from "./brick-animation.js";
// MODIFIED: Removed 'drawScore', added 'getHighScore'
import { drawLives, checkAndUpdateHighScore, getHighScore, getLeaderboardTop, upsertLeaderboardScore } from "./extra_features.js";
import { backgroundsound, hitSound, paddleSound } from "./sound.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pauseBtn = document.getElementById('pause-btn');

// NEW: HTML UI Element References
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const highScoreEl = document.getElementById('highScore');

// GAME STATE 
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

// MODIFIED: Welcomes the specific user
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
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

// INITIALIZATION 
// MODIFIED: Show main menu first
function init() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    generateBricks(canvas); 

    // NEW: First show main menu (Start, Resume, Leaderboard)
    showMainMenu();
}

// MAIN GAME LOOP 
function draw() {
    if (gameState.paused) return; // do not draw frames when paused

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw every element in its new position for the current frame
    drawBricks(ctx);
    drawParticles(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    
    // MODIFIED: Removed call to drawScore
    // drawScore(ctx, gameState.score); 
    
    drawLives(ctx, gameState.lives); // Lives still drawn on canvas
    backgroundsound();

    // update the score if the ball hit a brick and play a sound effect
    let scoreFromCollision = brickCollisionDetection(ball, bricks);
    if (scoreFromCollision > 0) {
        gameState.score += scoreFromCollision;
        // MODIFIED: Pass currentUser to update high score
        checkAndUpdateHighScore(gameState.score, currentUser); 
        hitSound.play();
    }
    
    // checks if all bricks have been broken so you can advance to next level
    handleLevelCompletion(ball, paddle, canvas);

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.speed;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }

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
                // Update leaderboard with final score
                upsertLeaderboardScore(currentUser, getHighScore(currentUser));
                overlaySource = 'gameover';
                showLeaderboardOverlay();
                return; // Stop the loop; overlay offers reload
            } else {
                // reset for the next try
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 50;
                paddle.x = (canvas.width - paddle.width) / 2;
                ball.dy *=-1; // ball moving up 
            }
        }
    }

    // NEW: Update the HTML UI bar every frame
    updateUIBar();

    //updates and redraws one frame of the game.
    gameState.rafId = requestAnimationFrame(draw);
}


function startGame() {
    // Event listeners are now added in promptForUsername
    // Using { once: true } auto-removes them.
    
    // Call draw() for the first time to kick off the animation loop.
    gameState.paused = false;
    hasActiveSession = true;
    draw();
}

// ----- Leaderboard Overlay -----
function buildLeaderboardHTML() {
    const top = getLeaderboardTop(10);
    const rows = top.map((e, idx) => {
        const you = e.username === currentUser ? " (you)" : "";
        return `<tr><td>${idx + 1}</td><td>${e.username}${you}</td><td>${e.score}</td></tr>`;
    }).join("");
    const gameOverHeader = overlaySource === 'gameover' 
        ? '<h2 style="margin:0 0 8px 0; text-align:center; color:#dd2476;">Game Over</h2>' 
        : '';
    return `
        <div id="leaderboard-overlay" class="overlay">
            <div class="overlay-content">
                ${gameOverHeader}
                <h2>Leaderboard</h2>
                <table>
                    <thead><tr><th>#</th><th>Player</th><th>High Score</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <div class="stack-buttons">
                    <button id="back-btn" class="btn btn-info">\u2190 Back</button>
                </div>
            </div>
        </div>`;
}

function showLeaderboardOverlay() {
    if (lastRunDisplayedLeaderboard && overlaySource === 'gameover') return;
    if (overlaySource === 'gameover') lastRunDisplayedLeaderboard = true;
    const existing = document.getElementById('leaderboard-overlay');
    if (existing) existing.remove();
    const container = document.createElement('div');
    container.innerHTML = buildLeaderboardHTML();
    document.body.appendChild(container.firstElementChild);
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.addEventListener('click', () => {
        const ov = document.getElementById('leaderboard-overlay');
        if (ov) ov.remove();
        // If we came from pause, go back to pause. If from gameover, open pause to offer options. If from menu, return to main menu
        if (overlaySource === 'pause' || overlaySource === 'gameover') {
            showPauseOverlay();
        } else {
            showMainMenu();
        }
    });
}

// ----- Pause Menu Overlay -----
function buildPauseMenuHTML() {
    return `
        <div id="pause-overlay" class="overlay">
            <div class="overlay-content">
                <button id="pause-back-btn" class="btn btn-info btn-small" style="position:absolute; top:10px; left:10px;">\u2190 Back</button>
                <h2>Paused</h2>
                <div class="stack-buttons">
                    <button id="resume-btn" class="btn btn-primary">Resume</button>
                    <button id="restart-level-btn" class="btn btn-success">Restart Level</button>
                    <button id="restart-game-btn" class="btn btn-warning">Restart Game</button>
                    <button id="show-leaderboard-btn" class="btn btn-info">Show Leaderboard</button>
                    <button id="add-player-btn" class="btn btn-primary">Add a New Player</button>
                    <div id="add-player-form" style="display:none; gap:8px; align-items:stretch;">
                        <input id="new-player-input" type="text" placeholder="New username" style="padding:10px 12px; border-radius:10px; border:1px solid #ccc; outline:none; font-size:16px;" />
                        <button id="confirm-add-player-btn" class="btn btn-success">Confirm</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function showPauseOverlay() {
    const existing = document.getElementById('pause-overlay');
    if (existing) return;
    const container = document.createElement('div');
    container.innerHTML = buildPauseMenuHTML();
    document.body.appendChild(container.firstElementChild);

    document.getElementById('pause-back-btn').addEventListener('click', () => {
        hidePauseOverlay();
        showResumePrompt();
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
        hidePauseOverlay();
        showResumePrompt();
    });
    document.getElementById('restart-level-btn').addEventListener('click', () => {
        hidePauseOverlay();
        restartLevel();
        showResumePrompt();
    });
    document.getElementById('restart-game-btn').addEventListener('click', () => {
        hidePauseOverlay();
        restartFullGame();
        showResumePrompt();
    });
    document.getElementById('show-leaderboard-btn').addEventListener('click', () => {
        hidePauseOverlay();
        upsertLeaderboardScore(currentUser, getHighScore(currentUser));
        overlaySource = 'pause';
        showLeaderboardOverlay();
    });
    const addBtn = document.getElementById('add-player-btn');
    const formEl = document.getElementById('add-player-form');
    const inputEl = document.getElementById('new-player-input');
    const confirmBtn = document.getElementById('confirm-add-player-btn');

    addBtn.addEventListener('click', () => {
        formEl.style.display = 'flex';
        inputEl.value = '';
        inputEl.focus();
    });

    function confirmAdd() {
        const name = inputEl.value.trim();
        if (!name) return;
        switchToUser(name);
    }

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmAdd();
    });
    confirmBtn.addEventListener('click', confirmAdd);
}

function hidePauseOverlay() {
    const el = document.getElementById('pause-overlay');
    if (el) el.remove();
}

function pauseGame() {
    if (gameState.paused) return;
    gameState.paused = true;
    if (gameState.rafId) {
        cancelAnimationFrame(gameState.rafId);
        gameState.rafId = null;
    }
    showPauseOverlay();
}

function resumeGame() {
    if (!gameState.paused) return;
    gameState.paused = false;
    draw();
}

function restartLevel() {
    // Regenerate bricks for the current level and reset positions; keep score, lives, and level
    generateBricks(canvas);
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 5;
    ball.dy = -5;
    paddle.x = (canvas.width - paddle.width) / 2;
    // keep paused; resume will be triggered by resume prompt
    gameState.paused = true;
}

function restartFullGame() {
    // Reset progression and regenerate base bricks
    resetToLevelOne(canvas);
    // Reset ball/paddle and score/lives
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.dx = 5;
    ball.dy = -5;
    paddle.x = (canvas.width - paddle.width) / 2;
    gameState.score = 0;
    gameState.lives = 3;
    updateUIBar();
    // keep paused; resume via prompt
    gameState.paused = true;
}

pauseBtn.addEventListener('click', () => {
    // always pause immediately and show menu
    pauseGame();
});

function switchToUser(name) {
    if (!isValidUsername(name)) {
        alert('Invalid name. Please type letters or letters and numbers.');
        return;
    }
    currentUser = name.trim();
    // reset current run score so the new user starts fresh
    gameState.score = 0;
    updateUIBar();
    hidePauseOverlay();
    showResumePrompt();
}

function showResumePrompt() {
    gameState.paused = true;
    drawResumeScreen();
    document.addEventListener('keydown', resumeGame, { once: true });
    document.addEventListener('click', resumeGame, { once: true });
}

// ----- Main Menu (first screen) -----
function buildMainMenuHTML() {
    const resumeDisabled = hasActiveSession ? '' : 'disabled';
    return `
        <div id="main-menu-overlay" class="overlay">
            <div class="overlay-content">
                <h2>Welcome to Brick Breaker</h2>
                <div class="stack-buttons">
                    <button id="menu-start-btn" class="btn btn-primary">Start New Game</button>
                    <button id="menu-resume-btn" class="btn btn-success" ${resumeDisabled}>Resume Game</button>
                    <button id="menu-leaderboard-btn" class="btn btn-info">Leaderboard</button>
                </div>
            </div>
        </div>`;
}

function showMainMenu() {
    const existing = document.getElementById('main-menu-overlay');
    if (existing) existing.remove();
    const container = document.createElement('div');
    container.innerHTML = buildMainMenuHTML();
    document.body.appendChild(container.firstElementChild);

    const startBtn = document.getElementById('menu-start-btn');
    const resumeBtn = document.getElementById('menu-resume-btn');
    const leaderboardBtn = document.getElementById('menu-leaderboard-btn');

    if (startBtn) startBtn.addEventListener('click', () => {
        const ov = document.getElementById('main-menu-overlay');
        if (ov) ov.remove();
        showStartOverlay();
    });
    if (resumeBtn) resumeBtn.addEventListener('click', () => {
        if (!hasActiveSession) return;
        const ov = document.getElementById('main-menu-overlay');
        if (ov) ov.remove();
        showResumePrompt();
    });
    if (leaderboardBtn) leaderboardBtn.addEventListener('click', () => {
        const ov = document.getElementById('main-menu-overlay');
        if (ov) ov.remove();
        overlaySource = 'menu';
        showLeaderboardOverlay();
    });
}

// run the intializing function
init();

// MODIFIED: Removed event listeners from here. 
// They are now added in promptForUsername after a name is entered.
// Auto-pause when page/tab visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseGame();
    }
});