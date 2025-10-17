export const paddle = {
    height: 15,
    width: 150,
    x: 0, // Initialized in game.js
    speed: 10
};

export function drawPaddle(ctx) {
    ctx.beginPath();
    let paddleY = ctx.canvas.height - paddle.height - 10; // A little offset from bottom
    ctx.rect(paddle.x, paddleY, paddle.width, paddle.height);

    // Paddle glow effect
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 20;
    
    ctx.fillStyle = '#FFFFFF'; // White paddle
    ctx.fill();
    ctx.closePath();

    // Reset shadow properties
    
    // to make other element not effictive by it  
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}


// 1. Power-up: increase paddle width for limited time 
export function expandPaddle(duration = 5000) {
    const originalWidth = paddle.width;
    paddle.width *= 1.5; //paddle width bigger by 50%
    
    setTimeout(() => {
        paddle.width = originalWidth; // return to normal after ending the time 
    }, duration);
}

// 2. Power-up: increase paddle speed  for limited time
export function boostPaddleSpeed(duration = 5000) {
    const originalSpeed = paddle.speed;
    paddle.speed *= 1.8; // extra speed by 80 %

    setTimeout(() => {
        paddle.speed = originalSpeed; // return to normal after ending the time 
    }, duration);
}

export function shrinkagePaddle(duration = 5000) {
    const originalWidth = paddle.width;
    paddle.width *= 0.5; //paddle width smaller by 50%
    
    setTimeout(() => {
        paddle.width = originalWidth; // return to normal after ending the time 
    }, duration);
}

// Power-up effect tracking
let activePowerUps = new Map();

// Apply temporary power-up effect
export function applyPowerUp(type, duration = 5000) {
    // Clear any existing power-up of the same type
    if (activePowerUps.has(type)) {
        clearTimeout(activePowerUps.get(type));
    }
    
    const originalWidth = paddle.width;
    const originalSpeed = paddle.speed;
    
    if (type === "expand") {
        paddle.width = Math.min(paddle.width * 1.5, 250); // Expand paddle (with max limit)
        const timeoutId = setTimeout(() => {
            paddle.width = originalWidth;
            activePowerUps.delete(type);
        }, duration);
        activePowerUps.set(type, timeoutId);
    } else if (type === "shrink") {
        paddle.width = Math.max(paddle.width * 0.5, 50); // Shrink paddle (with min limit)
        const timeoutId = setTimeout(() => {
            paddle.width = originalWidth;
            activePowerUps.delete(type);
        }, duration);
        activePowerUps.set(type, timeoutId);
    } else if (type === "speed") {
        paddle.speed *= 1.8; // Increase speed
        const timeoutId = setTimeout(() => {
            paddle.speed = originalSpeed;
            activePowerUps.delete(type);
        }, duration);
        activePowerUps.set(type, timeoutId);
    }
}

// Clear all active power-ups
export function clearAllPowerUps() {
    activePowerUps.forEach((timeoutId) => {
        clearTimeout(timeoutId);
    });
    activePowerUps.clear();
}




