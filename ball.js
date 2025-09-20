export let ball = {
    x: 0, // Initialized in game.js
    y: 0, // Initialized in game.js
    radius: 10,
    dx: 5,
    dy: -5
};

export function drawBall(ctx) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF'; // White ball
    ctx.fill();
    ctx.closePath();
}