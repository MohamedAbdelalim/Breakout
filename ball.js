export let ball = {
    x: 0, // Initialized in game.js
    y: 0, // Initialized in game.js
    radius: 10,
    dx: 5,
    dy: -5
};

// draw the ball with optimized rendering
export function drawBall(ctx) {
    // Use save/restore to avoid affecting other drawing operations
    ctx.save();
    
    // Set ball properties
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 10;
    
    // Draw ball with single path operation
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Restore context state
    ctx.restore();
}