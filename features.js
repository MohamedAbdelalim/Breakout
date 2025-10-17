// This file was imported but not provided.
// Created based on imports in game.js and new requirements.

// This function is no longer called by game.js, as score is in the HTML bar.
export function drawScore(ctx, score) {
    /*
    ctx.font = "24px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 30);
    */
}

// This function is still used to draw lives on the canvas.
export function drawLives(ctx, lives) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    // Draw lives in the top-right corner of the canvas
    ctx.fillText("Lives: " + lives, canvas.width - 20, 30);
}

// NEW: Gets the high score for a specific user from localStorage
export function getHighScore(username) {
    if (!username) return 0;
    // Use a prefix to avoid conflicts
    const key = `brickBreaker_${username}`;
    return localStorage.getItem(key) || 0;
}

// MODIFIED: Updates high score for a specific user in localStorage
export function checkAndUpdateHighScore(score, username) {
    if (!username) return; // Don't save if no user
    
    const key = `brickBreaker_${username}`;
    const userHighScore = localStorage.getItem(key) || 0;
    
    // localStorage stores strings, so convert to number for comparison
    if (score > parseInt(userHighScore)) {
        localStorage.setItem(key, score);
    }
}