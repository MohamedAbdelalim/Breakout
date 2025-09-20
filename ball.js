// Export the ball object so other files can import and use it.
export let ball = {
    x: 0, // We'll initialize this in main.js
    y: 0,
    radius: 12,
    dx: 4,
    dy: -4
};

// The drawing function now accepts the canvas context (ctx) as a parameter.
export function drawBall(ctx) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#4b279eff';
    ctx.fill();
    ctx.closePath();
}