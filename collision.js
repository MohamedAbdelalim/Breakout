import { createParticles } from "./bricks_animation.js";
import { hitBrick } from "./bricks.js";

export function brickCollisionDetection(ball, bricks) {
    let scoreGained = 0; // initialize Score
    
    // Optimize collision detection by checking only bricks near the ball
    const ballLeft = ball.x - ball.radius;
    const ballRight = ball.x + ball.radius;
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    
    for (const brick of bricks) {
        if (brick.alive) { // if brick exists
            // Quick bounding box check first (much faster than full collision)
            if (ballRight >= brick.x && ballLeft <= brick.x + brick.width &&
                ballBottom >= brick.y && ballTop <= brick.y + brick.height) {
                
                // More precise collision detection only if bounding box check passes
                if (ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brick.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brick.height) {
                    
                    ball.dy = -ball.dy; // change ball direction
                    
                    // Check if brick was frozen before hit
                    const wasFrozen = brick.frozen;
                    
                    // Hit the brick (handles frozen logic)
                    hitBrick(brick);
                    
                    // Create particle effect based on current state
                    if (wasFrozen && brick.alive) {
                        // Ice breaking effect (light blue particles)
                        createParticles(brick.x, brick.y, brick.width, brick.height, 'rgba(150, 200, 255, 0.8)');
                    } else if (!brick.alive) {
                        // Brick breaking effect (normal color)
                        createParticles(brick.x, brick.y, brick.width, brick.height, brick.color);
                        // Only add score when brick is completely destroyed
                        scoreGained += 10;
                    }
                }
            }
        }
    }
    return scoreGained;  // return the updated score
}

