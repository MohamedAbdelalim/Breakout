//Creates explosion particles when a brick is destroyed.

const PARTICLE_COUNT = 8;
const PARTICLE_LIFETIME = 60;
let particles = [];


export function createParticles(brickX, brickY, brickWidth, brickHeight, brickColor) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {

        particles.push({
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

// The drawParticles function is responsible for:
// - Updating the position of each particle based on its velocity and gravity.
// - Reducing the lifetime, size, and opacity of the particle over time.

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
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.closePath();
        if (p.lifetime <= 0) {
            particles.splice(i, 1);
        }
    }
}
//Creates explosion particles when a brick is destroyed.

const PARTICLE_COUNT = 8;
const PARTICLE_LIFETIME = 60;
let particles = [];


export function createParticles(brickX, brickY, brickWidth, brickHeight, brickColor) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {

        particles.push({
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

// The drawParticles function is responsible for:
// - Updating the position of each particle based on its velocity and gravity.
// - Reducing the lifetime, size, and opacity of the particle over time.

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
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.closePath();
        if (p.lifetime <= 0) {
            particles.splice(i, 1);
        }
    }
}


