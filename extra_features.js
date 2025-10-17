// Retrieve high score from localStorage, default to 0 if not set
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

// Update initial high score display
document.getElementById("high-score").textContent = highScore;

// Check and update high score if current score is higher
export function checkAndUpdateHighScore(currentScore) {
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem("highScore", highScore);
        document.getElementById("high-score").textContent = highScore;
        
        // Add visual feedback for new high score
        const scoreElement = document.getElementById("high-score");
        scoreElement.style.animation = "glow 0.5s ease-in-out";
        setTimeout(() => {
            scoreElement.style.animation = "";
        }, 500);
    }
}

// Update the current score display with animation
export function updateScoreDisplay(score) {
    const element = document.getElementById("current-score");
    element.textContent = score;
    
    // Add score change animation
    element.style.transform = "scale(1.2)";
    setTimeout(() => {
        element.style.transform = "scale(1)";
    }, 200);
}

// Update the lives display with visual feedback for changes
export function updateLivesDisplay(lives) {
    const element = document.getElementById("lives-count");
    const oldValue = parseInt(element.textContent);
    element.textContent = lives;
    
    // Add visual feedback for life changes
    if (lives < oldValue) {
        element.style.color = "#ff6b6b";
        element.style.animation = "shake 0.5s ease-in-out";
    } else if (lives > oldValue) {
        element.style.color = "#4facfe";
        element.style.animation = "bounce 0.5s ease-in-out";
    }
    
    setTimeout(() => {
        element.style.color = "";
        element.style.animation = "";
    }, 500);
}

// Update the level display with animation
export function updateLevelDisplay(level) {
    const element = document.getElementById("current-level");
    element.textContent = level;
    
    // Add level up animation
    element.style.animation = "levelUp 0.5s ease-in-out";
    setTimeout(() => {
        element.style.animation = "";
    }, 500);
}

// Show level complete modal
export function showLevelCompleteModal(level, callback) {
    const modal = document.getElementById("level-complete-modal");
    const text = document.getElementById("level-complete-text");
    const btn = document.getElementById("next-level-btn");
    
    text.textContent = `Level ${level} Complete!`;
    modal.classList.add("active");
    
    // Create new button to avoid multiple event listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        if (callback) callback();
    });
}

// Show game over modal
export function showGameOverModal(finalScore) {
    const modal = document.getElementById("game-over-modal");
    const text = document.getElementById("final-score-text");
    const btn = document.getElementById("restart-btn");
    
    text.textContent = `Final Score: ${finalScore}`;
    modal.classList.add("active");
    
    // Create new button to avoid multiple event listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        location.reload();
    });
}

// Add CSS animations for visual effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes glow {
        0% { text-shadow: 0 0 5px #00f2fe; }
        50% { text-shadow: 0 0 20px #00f2fe; }
        100% { text-shadow: 0 0 5px #00f2fe; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes levelUp {
        0% { transform: scale(1); }
        50% { transform: scale(1.5); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(styleSheet);
// Utilities for lives rendering, per-user high scores, and leaderboard persistence

// Draw lives count on the canvas (top-right)
export function drawLives(ctx, lives) {
    const canvas = ctx.canvas;
    ctx.font = "24px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.fillText("Lives: " + lives, canvas.width - 20, 30);
}

// ----- Per-user High Score (localStorage) -----

function userKey(username) {
    return `brickBreaker_${username}`;
}

export function getHighScore(username) {
    if (!username) return 0;
    const value = localStorage.getItem(userKey(username));
    return value ? parseInt(value) : 0;
}

export function checkAndUpdateHighScore(score, username) {
    if (!username) return;
    const current = getHighScore(username);
    if (score > current) {
        localStorage.setItem(userKey(username), String(score));
        // also reflect to leaderboard store
        upsertLeaderboardScore(username, score);
    }
}

// ----- Leaderboard (top scores across users) -----

const LEADERBOARD_KEY = "brickBreaker_leaderboard";

function getLeaderboard() {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    try {
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function setLeaderboard(entries) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

export function upsertLeaderboardScore(username, score) {
    if (!username) return;
    const list = getLeaderboard();
    const existingIndex = list.findIndex(e => e.username === username);
    if (existingIndex >= 0) {
        // keep the highest score
        if (score > list[existingIndex].score) {
            list[existingIndex].score = score;
        }
    } else {
        list.push({ username, score });
    }
    // sort desc by score and keep top 10
    list.sort((a, b) => b.score - a.score);
    setLeaderboard(list.slice(0, 10));
}

export function getLeaderboardTop(limit = 10) {
    const list = getLeaderboard();
    return list
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}


