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