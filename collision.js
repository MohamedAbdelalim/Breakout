import { createParticles } from "./brick-animation.js";


export function brickCollisionDetection(ball, bricks) {
    let scoreGained = 0; // initialize Score
    for (const brick of bricks) {
        if (brick.alive) { // if brick exists
            if ( // checks collision
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {
                ball.dy = -ball.dy; // change ball direction
                brick.alive = false; // make brick disapire 
                // creating breaking effect 
                createParticles(brick.x, brick.y, brick.width, brick.height, brick.color);
                // update score with 10
                scoreGained += 10;
            }
        }
    }
    return scoreGained;  // return the updated score
}
import { createParticles } from "./bricks_animations.js";


export function brickCollisionDetection(ball, bricks) {
    let scoreGained = 0; // initialize Score
    for (const brick of bricks) {
        if (brick.alive) { // if brick exists
            if ( // checks collision
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {
                ball.dy = -ball.dy; // change ball direction
                brick.alive = false; // make brick disapire 
                // creating breaking effect 
                createParticles(brick.x, brick.y, brick.width, brick.height, brick.color);
                // update score with 10
                scoreGained += 10;
            }
        }
    }
    return scoreGained;  // return the updated score
}


