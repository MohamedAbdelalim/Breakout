// This variable holds the high score for the current session.
// It loads from localStorage once when the game starts.
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

/**
 * Checks if the current score is a new high score and saves it if it is.
 * This function must be called every time the score changes.
 * @param {number} currentScore The player's current score from the game.
 */
export function checkAndUpdateHighScore(currentScore) {
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem("highScore", highScore);
    }
}

/**
 * Draws the current score and the high score on the canvas.
 * @param {CanvasRenderingContext2D} ctx The canvas context.
 * @param {number} score The player's current score.
 */
export function drawScore(ctx, score) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#ffffffff";
    ctx.textAlign = "left";

    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Highest Score: " + highScore, 20, 60);

}

/**
 * Draws the remaining lives on the canvas.
 * @param {CanvasRenderingContext2D} ctx The canvas context.
 * @param {number} lives The player's remaining lives.
 */
export function drawLives(ctx, lives) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#dd8500ff";
    ctx.fillText("Lives: " + lives, ctx.canvas.width - 100, 30);
}