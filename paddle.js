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