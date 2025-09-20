// bricks_animations.js (Corrected)

const PARTICLE_COUNT = 8;
const PARTICLE_LIFETIME = 60;
let particles = [];

// ✨ FIX: Added brickWidth and brickHeight as parameters
export function createParticles(brickX, brickY, brickWidth, brickHeight, brickColor) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            // ✨ FIX: Use the new parameters instead of brickInfo
            x: brickX + brickWidth / 2, 
            y: brickY + brickHeight / 2,
            size: Math.random() * 8 + 3,
            dx: (Math.random() - 0.5) * 8,
            dy: (Math.random() - 0.5) * 8,
            color: brickColor,
            lifetime: PARTICLE_LIFETIME,
            maxLifetime: PARTICLE_LIFETIME
        });
    }
}

// This function is already correct
export function drawParticles(ctx) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.2;
        p.lifetime--;
        let opacity = p.lifetime / p.maxLifetime;
        let currentSize = p.size * opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(p.color.slice(1,3), 16)}, ${parseInt(p.color.slice(3,5), 16)}, ${parseInt(p.color.slice(5,7), 16)}, ${opacity})`;
        ctx.fill();
        ctx.closePath();
        if (p.lifetime <= 0) {
            particles.splice(i, 1);
        }
    }
}