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

