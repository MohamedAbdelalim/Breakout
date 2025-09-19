let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 12,
    dx: 4,  // Speed increased a bit
    dy: -4
};

export function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#4b279eff';
    ctx.fill();
    ctx.closePath();
}
