// collision.js (Corrected)

import { createParticles } from "./bricks_animations.js";


export function brickCollisionDetection(ball, bricks) {
    let scoreGained = 0;
    for (const brick of bricks) {
        if (brick.alive) {
            if (
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {
                ball.dy = -ball.dy;
                brick.alive = false;
                
                // ✨ FIX: Pass the brick's width and height to the function
                createParticles(brick.x, brick.y, brick.width, brick.height, brick.color);
                
                scoreGained += 10;
            }
        }
    }
    return scoreGained;
}