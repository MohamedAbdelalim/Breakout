// Note: High score display is now handled dynamically per player in game.js
// This ensures each player sees their own high score from the leaderboard

// Check and update high score if current score is higher
export function checkAndUpdateHighScore(currentScore, username = null) {
    if (!username) return;
    
    const userHighScore = getHighScore(username);
    if (currentScore > userHighScore) {
        // Update user's individual high score storage
        localStorage.setItem(userKey(username), currentScore.toString());
        
        // Update leaderboard as well
        upsertLeaderboardScore(username, currentScore);
        
        // Update display immediately with visual feedback
        const scoreElement = document.getElementById("high-score");
        if (scoreElement) {
            scoreElement.textContent = currentScore;
            // Add visual feedback for new high score
            scoreElement.style.animation = "glow 0.5s ease-in-out";
            scoreElement.style.color = "#ffd700"; // Gold color for new high score
            setTimeout(() => {
                scoreElement.style.animation = "";
                scoreElement.style.color = ""; // Reset color
            }, 1000);
        }
    }
}

// Update the current score display with animation
export function updateScoreDisplay(score) {
    const element = document.getElementById("current-score");
    if (element) {
        element.textContent = score;
        // Add score change animation
        element.style.transform = "scale(1.2)";
        setTimeout(() => {
            element.style.transform = "scale(1)";
        }, 200);
    }
}

// Update the lives display with visual feedback for changes
export function updateLivesDisplay(lives) {
    const element = document.getElementById("lives-count");
    if (element) {
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
export function showLevelCompleteModal(level, callback, isInfinityMode = true) {
    const modal = document.getElementById("level-complete-modal");
    const text = document.getElementById("level-complete-text");
    const nextBtn = document.getElementById("next-level-btn");
    const restartBtn = document.getElementById("restart-level-complete-btn");
    const mainMenuBtn = document.getElementById("main-menu-complete-btn");
    
    text.textContent = `Level ${level} Complete!`;
    modal.classList.add("active");
    
    if (isInfinityMode) {
        // Show "Next Level" button for infinity mode
        nextBtn.style.display = "block";
        restartBtn.style.display = "none";
        mainMenuBtn.style.display = "none";
        
        // Create new button to avoid multiple event listeners
        const newBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newBtn, nextBtn);
        
        newBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            if (callback) callback();
        });
    } else {
        // Show "Restart Level" and "Main Menu" buttons for other difficulties
        nextBtn.style.display = "none";
        restartBtn.style.display = "block";
        mainMenuBtn.style.display = "block";
        
        // Create new buttons to avoid multiple event listeners
        const newRestartBtn = restartBtn.cloneNode(true);
        const newMainMenuBtn = mainMenuBtn.cloneNode(true);
        restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
        mainMenuBtn.parentNode.replaceChild(newMainMenuBtn, mainMenuBtn);
        
        newRestartBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            if (callback) callback();
        });
        
        newMainMenuBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            // Go to main menu
            if (typeof window.showMainMenu === 'function') {
                window.showMainMenu();
            }
        });
    }
}

// Show game over modal
export function showGameOverModal(finalScore) {
    const modal = document.getElementById("game-over-modal");
    const text = document.getElementById("final-score-text");
    
    text.textContent = `Final Score: ${finalScore}`;
    modal.classList.add("active");
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
// ----- Per-user High Score (localStorage) -----

function userKey(username) {
    return `brickBreaker_${username}`;
}

export function getHighScore(username) {
    if (!username) return 0;
    
    // First check individual user storage
    const value = localStorage.getItem(userKey(username));
    if (value) {
        return parseInt(value);
    }
    
    // If not found in individual storage, check leaderboard
    const leaderboard = getLeaderboard();
    const existingEntry = leaderboard.find(entry => entry.username === username);
    if (existingEntry) {
        // Update individual storage with leaderboard value for consistency
        localStorage.setItem(userKey(username), existingEntry.score.toString());
        return existingEntry.score;
    }
    
    return 0;
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


