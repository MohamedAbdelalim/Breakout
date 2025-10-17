import { ball, drawBall } from "./ball.js";
import { paddle, drawPaddle } from "./paddle.js";
import { 
    bricks, 
    generateBricks, 
    drawBricks, 
    spawnPowerUp, 
    drawPowerUps, 
    updatePowerUps 
} from "./bricks.js";
import { brickCollisionDetection } from "./collision.js";
import { rightPressed, leftPressed } from "./game_input.js";
import { drawParticles } from "./bricks_animation.js";
import { 
    updateScoreDisplay, 
    updateLivesDisplay, 
    checkAndUpdateHighScore,
    showGameOverModal,
    showLevelCompleteModal,
    getHighScore,
    upsertLeaderboardScore,
    getLeaderboardTop
} from "./extra_features.js";
import { 
    backgroundsound, 
    hitSound, 
    paddleSound, 
    backgroundSound,
    playBackgroundSound,
    stopBackgroundSound,
    toggleSound,
    setMusicVolume,
    setSFXVolume,
    isSoundEnabled,
    playSound
} from "./sound.js";

// Canvas and context setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const nameInputModal = document.getElementById('name-input-modal');
const playerNameInput = document.getElementById('player-name-input');
const continueBtn = document.getElementById('continue-btn');

const menu = document.getElementById('menu');
const welcomeText = document.getElementById('welcome-text');
const startBtn = document.getElementById('startBtn');
const settingsBtn = document.getElementById('settingsBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const soundBtn = document.getElementById('soundBtn');
const infoText = document.getElementById('infoText');

const difficultyMenu = document.getElementById('difficulty-menu');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

const settingsMenu = document.getElementById('settings-menu');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const musicVolumeSlider = document.getElementById('music-volume');
const sfxVolumeSlider = document.getElementById('sfx-volume');
const backToMainBtn = document.getElementById('back-to-main-btn');

const leaderboardMenu = document.getElementById('leaderboard-menu');
const leaderboardContent = document.getElementById('leaderboard-content');
const backToMainLeaderboardBtn = document.getElementById('back-to-main-leaderboard-btn');

// Modal elements
const pauseModal = document.getElementById('pause-modal');
const resumeBtn = document.getElementById('resume-btn');
const pauseSettingsBtn = document.getElementById('pause-settings-btn');
const pauseMainMenuBtn = document.getElementById('pause-main-menu-btn');

const gameOverModal = document.getElementById('game-over-modal');
const restartLevelBtn = document.getElementById('restart-level-btn');
const gameOverSettingsBtn = document.getElementById('game-over-settings-btn');
const gameOverMainMenuBtn = document.getElementById('game-over-main-menu-btn');

const resumeFromSettingsBtn = document.getElementById('resume-from-settings-btn');

// Game state
let gameState = {
    score: 0,
    lives: 3,
    level: 1,
    difficulty: 'easy'
};

let currentPlayer = '';
let gameRunning = false;
let levelCompleted = false;
let animationId = null;
let gamePaused = false;
let settingsFromPause = false;

// Difficulty settings
const difficultySettings = {
    easy: { brickRows: 3, brickCols: 4, ballSpeed: 4, lives: 5 },
    medium: { brickRows: 4, brickCols: 5, ballSpeed: 5, lives: 3 },
    hard: { brickRows: 5, brickCols: 6, ballSpeed: 6, lives: 2 },
    infinity: { brickRows: 6, brickCols: 8, ballSpeed: 7, lives: 1 }
};

// Initialize the game
function init() {
    // Hide game container initially
    document.querySelector('.game-container').style.display = 'none';
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize sound
    updateSoundButton();
}

// Set up all event listeners
function setupEventListeners() {
    // Name input
    continueBtn.addEventListener('click', handleNameContinue);
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNameContinue();
    });

    // Main menu
    startBtn.addEventListener('click', showDifficultyMenu);
    settingsBtn.addEventListener('click', showSettingsMenu);
    leaderboardBtn.addEventListener('click', showLeaderboardMenu);
    soundBtn.addEventListener('click', toggleSoundButton);

    // Difficulty menu
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const difficulty = e.target.dataset.difficulty;
            startGame(difficulty);
        });
    });
    backToMenuBtn.addEventListener('click', showMainMenu);

    // Settings menu
    soundToggleBtn.addEventListener('click', toggleSoundButton);
    musicVolumeSlider.addEventListener('input', (e) => {
        setMusicVolume(e.target.value);
    });
    sfxVolumeSlider.addEventListener('input', (e) => {
        setSFXVolume(e.target.value);
    });
    backToMainBtn.addEventListener('click', showMainMenu);
    resumeFromSettingsBtn.addEventListener('click', () => {
        settingsMenu.style.display = 'none';
        settingsFromPause = false;
        resumeFromSettingsBtn.style.display = 'none';
        resumeGame();
    });

    // Leaderboard menu
    backToMainLeaderboardBtn.addEventListener('click', showMainMenu);

    // Pause menu
    resumeBtn.addEventListener('click', resumeGame);
    pauseSettingsBtn.addEventListener('click', () => {
        pauseModal.classList.remove('active');
        settingsFromPause = true;
        showSettingsMenu();
    });
    pauseMainMenuBtn.addEventListener('click', () => {
        pauseModal.classList.remove('active');
        stopBackgroundSound();
        showMainMenu();
        resetGame();
    });

    // Game over menu
    restartLevelBtn.addEventListener('click', restartCurrentLevel);
    gameOverSettingsBtn.addEventListener('click', () => {
        gameOverModal.classList.remove('active');
        showSettingsMenu();
    });
    gameOverMainMenuBtn.addEventListener('click', () => {
        gameOverModal.classList.remove('active');
        stopBackgroundSound();
        showMainMenu();
        resetGame();
    });

    // ESC key for pause
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameRunning && !gamePaused) {
            pauseGame();
        }
    });
}

// Handle name input and continue
function handleNameContinue() {
    const name = playerNameInput.value.trim();
    if (name.length < 2) {
        alert('Please enter a name with at least 2 characters');
        return;
    }
    
    currentPlayer = name;
    nameInputModal.classList.remove('active');
    showMainMenu();
}

// Show main menu
function showMainMenu() {
    hideAllMenus();
    menu.style.display = 'flex';
    welcomeText.textContent = `Welcome, ${currentPlayer}!`;
    
    // Update high score display
    const highScore = getHighScore(currentPlayer);
    infoText.textContent = `Highest Score: ${highScore}`;
    
    updateSoundButton();
}

// Show difficulty selection menu
function showDifficultyMenu() {
    hideAllMenus();
    difficultyMenu.style.display = 'flex';
}

// Show settings menu
function showSettingsMenu() {
    hideAllMenus();
    settingsMenu.style.display = 'flex';
    updateSoundButton();
    
    // Show resume button if accessed from pause
    if (settingsFromPause) {
        resumeFromSettingsBtn.style.display = 'block';
    } else {
        resumeFromSettingsBtn.style.display = 'none';
    }
}

// Show leaderboard menu
function showLeaderboardMenu() {
    hideAllMenus();
    leaderboardMenu.style.display = 'flex';
    updateLeaderboard();
}

// Hide all menus
function hideAllMenus() {
    menu.style.display = 'none';
    difficultyMenu.style.display = 'none';
    settingsMenu.style.display = 'none';
    leaderboardMenu.style.display = 'none';
}

// Update leaderboard display
function updateLeaderboard() {
    const leaderboard = getLeaderboardTop(10);
    
    if (leaderboard.length === 0) {
        leaderboardContent.innerHTML = '<p>No scores yet! Be the first to play!</p>';
        return;
    }
    
    leaderboardContent.innerHTML = leaderboard.map((entry, index) => `
        <div class="leaderboard-entry">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${entry.username}</span>
            <span class="leaderboard-score">${entry.score}</span>
        </div>
    `).join('');
}

// Toggle sound button
function toggleSoundButton() {
    const isEnabled = toggleSound();
    updateSoundButton();
}

// Update sound button text
function updateSoundButton() {
    const soundButtons = [soundBtn, soundToggleBtn];
    soundButtons.forEach(btn => {
        if (btn) {
            btn.textContent = isSoundEnabled ? "🔈 Sound: ON" : "🔇 Sound: OFF";
        }
    });
}

// Pause game
function pauseGame() {
    gamePaused = true;
    gameRunning = false;
    pauseModal.classList.add('active');
}

// Resume game
function resumeGame() {
    gamePaused = false;
    gameRunning = true;
    pauseModal.classList.remove('active');
    draw(); // Resume game loop
}

// Restart current level
function restartCurrentLevel() {
    gameOverModal.classList.remove('active');
    
    // Reset ball and paddle positions
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // Reset ball speed based on difficulty
    const settings = difficultySettings[gameState.difficulty];
    ball.dx = settings.ballSpeed;
    ball.dy = -settings.ballSpeed;
    
    // Reset lives based on difficulty
    gameState.lives = settings.lives;
    
    // Generate new bricks for current level
    generateBricks(canvas);
    
    updateUIBar();
    
    // Resume game
    gameRunning = true;
    levelCompleted = false;
    draw();
}

// Start game with selected difficulty
function startGame(difficulty) {
    gameState.difficulty = difficulty;
    const settings = difficultySettings[difficulty];
    
    // Apply difficulty settings
    gameState.lives = settings.lives;
    ball.dx = settings.ballSpeed;
    ball.dy = -settings.ballSpeed;
    
    // Hide menu and show game
    hideAllMenus();
    document.querySelector('.game-container').style.display = 'block';
    
    // Initialize game
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // Generate bricks based on difficulty
    generateBricks(canvas);
    
    // Update UI
    updateUIBar();
    
    // Start game loop
    gameRunning = true;
    levelCompleted = false;
    
    // Start background music
    playBackgroundSound();
    
    // Start drawing
    draw();
}

// Update UI bar
function updateUIBar() {
    updateScoreDisplay(gameState.score);
    updateLivesDisplay(gameState.lives);
    
    // Update level display
    const levelEl = document.getElementById('current-level');
    if (levelEl) levelEl.textContent = gameState.level;
    
    // Update high score display
    const highScoreEl = document.getElementById('high-score');
    if (highScoreEl) highScoreEl.textContent = getHighScore(currentPlayer);
}

// Main game loop
function draw() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawBricks(ctx, canvas, gameState.difficulty, gameState.level);
    drawParticles(ctx);
    drawPowerUps(ctx);
    drawBall(ctx);
    drawPaddle(ctx);
    updateUIBar();
    backgroundsound();

    // Handle brick collisions
    let scoreFromCollision = brickCollisionDetection(ball, bricks);

    if (scoreFromCollision > 0) {
        gameState.score += scoreFromCollision;
        checkAndUpdateHighScore(gameState.score, currentPlayer);
        upsertLeaderboardScore(currentPlayer, gameState.score);
        playSound(hitSound);
        
        // Update high score display immediately
        updateUIBar();
        
        // Spawn power-ups for newly broken bricks
        for (const brick of bricks) {
            if (!brick.alive && !brick.checked) {
                brick.checked = true;
                spawnPowerUp(brick);
            }
        }
    }
    
    // Check for level completion
    const allBroken = bricks.every((brick) => !brick.alive);
    if (allBroken && !levelCompleted) {
        levelCompleted = true;
        gameRunning = false;
        
        // Only show level completion for infinity mode
        if (gameState.difficulty === 'infinity') {
            showLevelCompleteModal(gameState.level, () => {
                gameState.level++;
                updateUIBar();
                startNextLevel();
                levelCompleted = false;
                gameRunning = true;
            });
        } else {
            // For other difficulties, just restart the same level
            setTimeout(() => {
                generateBricks(canvas);
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 50;
                paddle.x = (canvas.width - paddle.width) / 2;
                levelCompleted = false;
                gameRunning = true;
            }, 1000);
        }
    }

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
        const paddleY = canvas.height - paddle.height - 10;
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.radius > paddleY) {
            ball.dy = -ball.dy;
            playSound(paddleSound);
        } else {
            // Lose a life
            gameState.lives--;
            if (gameState.lives <= 0) {
                gameRunning = false;
                stopBackgroundSound();
                showGameOverModal(gameState.score);
                return;
            } else {
                // Reset ball and paddle
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 50;
                paddle.x = (canvas.width - paddle.width) / 2;
                ball.dy = Math.abs(ball.dy);
            }
        }
    }

    updatePowerUps(paddle, canvas, gameState);

    animationId = requestAnimationFrame(draw);
}

// Start next level
function startNextLevel() {
    levelCompleted = false;
    
    // Increase difficulty slightly for infinity mode
    if (gameState.difficulty === 'infinity') {
        ball.dx = Math.abs(ball.dx) + 0.2;
        ball.dy = Math.abs(ball.dy) + 0.2;
    }
    
    // Generate new bricks
    generateBricks(canvas);
    
    // Reset ball and paddle positions
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    ball.dx = Math.abs(ball.dx);
    ball.dy = -Math.abs(ball.dy);
    
    updateUIBar();
}

// Reset game to initial state
function resetGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameRunning = false;
    levelCompleted = false;
    
    // Reset ball and paddle positions
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // Reset ball speed based on difficulty
    const settings = difficultySettings[gameState.difficulty];
    ball.dx = settings.ballSpeed;
    ball.dy = -settings.ballSpeed;
    
    // Reset lives based on difficulty
    gameState.lives = settings.lives;
    
    // Generate new bricks
    generateBricks(canvas);
    
    updateUIBar();
}

// Show menu function (for compatibility with existing code)
function showMenu() {
    stopBackgroundSound();
    
    // Stop drawing
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Hide game and show menu
    document.querySelector('.game-container').style.display = 'none';
    showMainMenu();
    
    // Reset game state
    gameState.score = 0;
    gameState.level = 1;
    gameRunning = false;
    gamePaused = false;
    levelCompleted = false;
    
    // Update high score text
    const highScore = getHighScore(currentPlayer);
    infoText.textContent = `Highest Score: ${highScore}`;
    
    updateSoundButton();
}

// Initialize the game when page loads
init();